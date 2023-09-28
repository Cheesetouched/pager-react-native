import { useCallback, useEffect, useMemo, useState } from "react";

import * as Contacts from "expo-contacts";

import Countries from "@utils/countries";
import { cleanupPhone, resize } from "@utils/helpers";
import useCheckInvites from "@hooks/queries/useCheckInvites";
import useContactsSearch from "@hooks/queries/useContactsSearch";

export default function useContacts(props = {}) {
  // Make sure these prop functions are wrapped in a useCallback
  // function, inside the hook consumer, to prevent unnecessary
  // re-rendering

  const { userPhone, onDenied } = props;
  const [contacts, setContacts] = useState(null);
  const [inMemory, setInMemory] = useState(null);
  const [permission, setPermission] = useState(null);
  const [numbersOnly, setNumbersOnly] = useState(null);
  const [friendsOnApp, setFriendsOnApp] = useState([]);
  // Breaking import order here because otherwise numbersOnly
  // would be undefined when passed to the useContactsSearch hook
  const invites = useCheckInvites(userPhone);
  const contactsSearch = useContactsSearch(numbersOnly);

  const getContacts = useCallback(async () => {
    if (userPhone) {
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
    }
  }, [processContacts, userPhone]);

  const processContacts = useCallback(
    async (contacts) => {
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
            const country_code =
              Countries[contact?.phoneNumbers[0]?.countryCode];
            const number = cleanupPhone(contact?.phoneNumbers[0]?.digits);
            const full = number?.includes("+")
              ? number
              : `${country_code}${number}`;

            // Removing the number of the logged in user
            if (full !== userPhone) {
              allNumbers.push(full);
            }

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
    },
    [userPhone],
  );

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
    if (contactsSearch?.success) {
      setFriendsOnApp(contactsSearch?.results);
    }

    if (contactsSearch?.success && invites?.success) {
      const inviterUids = invites?.inviters?.map((inviter) => inviter?.id);

      // Removing people from the list if they are already in the
      // invite list or if the person is the logged in user
      setFriendsOnApp((current) =>
        current.filter((friend) => {
          return (
            !inviterUids?.includes(friend?.objectID) &&
            friend?.phone?.full !== userPhone
          );
        }),
      );
    }
  }, [contactsSearch, invites, userPhone]);

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
      friendsOnApp,
      invites,
      permission,
      ready: typeof userPhone === "string",
      requestContacts,
      searchContacts,
    }),
    [
      contacts,
      friendsOnApp,
      invites,
      permission,
      requestContacts,
      searchContacts,
      userPhone,
    ],
  );
}
