import { useCallback, useEffect, useMemo, useState } from "react";

import * as Contacts from "expo-contacts";

import useUser from "@hooks/useUser";
import Countries from "@utils/countries";
import { cleanupPhone, resize } from "@utils/helpers";
import useCheckInvites from "@queries/useCheckInvites";
import useContactsSearch from "@queries/useContactsSearch";

export default function useContacts(props = {}) {
  // Make sure these prop functions are wrapped in a useCallback
  // function, inside the hook consumer, to prevent unnecessary
  // re-rendering

  const { onDenied } = props;
  const { userData } = useUser();
  const [contacts, setContacts] = useState(null);
  const [inMemory, setInMemory] = useState(null);
  const [permission, setPermission] = useState(null);
  const [numbersOnly, setNumbersOnly] = useState(null);
  const contactSearch = useContactsSearch(numbersOnly);
  const invites = useCheckInvites(userData?.phone?.full);

  const getContacts = useCallback(async () => {
    Contacts.getContactsAsync({
      fields: [
        Contacts.Fields.Name,
        Contacts.Fields.Image,
        Contacts.Fields.PhoneNumbers,
      ],
      sort: Contacts.SortTypes.UserDefault,
    }).then(async (contacts) => {
      const { processed, numbersOnly } = await processContacts(contacts);
      setContacts(processed);
      setInMemory(processed);
      setNumbersOnly(numbersOnly);
    });
  }, [processContacts]);

  const processContacts = useCallback(async (contacts) => {
    const allNumbers = [];
    const withPhotos = [];
    const withoutPhotos = [];

    await Promise.all(
      contacts?.data?.map(async (contact) => {
        if (
          contact?.name &&
          contact?.name !== "" &&
          contact?.phoneNumbers?.length > 0
        ) {
          const country_code = Countries[contact?.phoneNumbers[0]?.countryCode];
          const number = cleanupPhone(contact?.phoneNumbers[0]?.digits);
          const full = number?.includes("+")
            ? number
            : `${country_code}${number}`;

          allNumbers.push(full);

          if (contact?.image) {
            withPhotos.push({
              dp: await resize(contact?.image, 100, 100),
              id: contact?.id,
              name: contact?.name,
              phone: {
                country_code,
                full,
                number,
              },
            });
          } else {
            withoutPhotos.push({
              id: contact?.id,
              name: contact?.name,
              phone: {
                country_code,
                full,
                number,
              },
            });
          }
        }
      }),
    );

    return {
      processed: [...withPhotos, ...withoutPhotos],
      numbersOnly: allNumbers,
    };
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

  const searchContacts = useCallback(
    (text) => {
      const filtered = inMemory.filter((contact) => {
        const lowercase = contact?.name.toLowerCase();
        const searchTerm = text.toString().toLowerCase();
        return lowercase.indexOf(searchTerm) > -1;
      });

      setContacts(filtered);
    },
    [inMemory],
  );

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
      contactSearch,
      invites,
      permission,
      requestContacts,
      searchContacts,
    }),
    [
      contacts,
      contactSearch,
      invites,
      permission,
      requestContacts,
      searchContacts,
    ],
  );
}
