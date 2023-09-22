import { useCallback, useEffect, useMemo, useState } from "react";

import * as Contacts from "expo-contacts";

import { cleanupPhone, resize } from "@utils/helpers";

export default function useContacts(props = {}) {
  // Make sure these prop functions are wrapped in a useCallback
  // function, inside the hook consumer, to prevent unnecessary
  // re-rendering

  const { onDenied } = props;
  const [contacts, setContacts] = useState(null);
  const [permission, setPermission] = useState(null);

  const getContacts = useCallback(async () => {
    Contacts.getContactsAsync({
      fields: [
        Contacts.Fields.Name,
        Contacts.Fields.Image,
        Contacts.Fields.PhoneNumbers,
      ],
      sort: Contacts.SortTypes.UserDefault,
    }).then(async (contacts) => {
      const processed = await processContacts(contacts);
      setContacts(processed);
    });
  }, [processContacts]);

  const processContacts = useCallback(async (contacts) => {
    const withPhotos = [];
    const withoutPhotos = [];

    await Promise.all(
      contacts?.data?.map(async (contact) => {
        if (
          contact?.name &&
          contact?.name !== "" &&
          contact?.phoneNumbers?.length > 0
        ) {
          if (contact?.image) {
            withPhotos.push({
              id: contact?.id,
              name: contact?.name,
              number: cleanupPhone(contact?.phoneNumbers[0]?.digits),
              image: await resize(contact?.image, 250, 500),
            });
          } else {
            withoutPhotos.push({
              id: contact?.id,
              name: contact?.name,
              number: cleanupPhone(contact?.phoneNumbers[0]?.digits),
            });
          }
        }
      }),
    );

    return [...withPhotos, ...withoutPhotos];
  }, []);

  const requestContacts = useCallback(async () => {
    let finalPermission = permission;

    if (permission.status !== "granted") {
      const request = await Contacts.requestPermissionsAsync();
      finalPermission = request;
      setPermission(request);
    }

    if (finalPermission.status === "granted") {
      getContacts();
    } else {
      onDenied();
    }
  }, [getContacts, onDenied, permission]);

  useEffect(() => {
    Contacts.getPermissionsAsync().then((permission) => {
      setPermission(permission);

      if (permission.granted) {
        getContacts();
      }
    });
  }, [getContacts]);

  return useMemo(
    () => ({
      contacts,
      requestContacts,
      permission,
    }),
    [contacts, permission, requestContacts],
  );
}