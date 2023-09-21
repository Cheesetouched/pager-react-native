import { useCallback, useEffect, useMemo, useState } from "react";

import * as Contacts from "expo-contacts";

export default function useContacts(props = {}) {
  const { onDenied } = props;
  const [contacts, setContacts] = useState(null);
  const [permission, setPermission] = useState(null);

  const getContacts = useCallback(async () => {
    Contacts.getContactsAsync({ sort: "firstName" }).then((contacts) => {
      setContacts(contacts);
    });
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
