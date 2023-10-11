import * as ImageManipulator from "expo-image-manipulator";
import { differenceInHours, differenceInMinutes } from "date-fns";

export function cleanupPhone(phone) {
  return phone.trim().replace(/\s/g, "");
}

export function freeFor(freeTill, format = "small") {
  const current = new Date();
  const diffInHours = differenceInHours(freeTill, current);
  const diffInMinutes = differenceInMinutes(freeTill, current);

  if (diffInHours > 0) {
    return `${diffInHours}${format === "small" ? "hr" : "hour"} 👋🏻`;
  } else {
    return `${diffInMinutes}${format === "small" ? "m" : " mins"} 👋🏻`;
  }
}

export async function getBlobFromUri(uri) {
  return await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function () {
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });
}

export function isPageValid(validTill) {
  if (!validTill) {
    return false;
  }

  if (Date.now() <= validTill) {
    return true;
  } else {
    return false;
  }
}

export function msToTime(s) {
  const ms = s % 1000;
  s = (s - ms) / 1000;
  const secs = s % 60;
  s = (s - secs) / 60;
  const mins = s % 60;
  const hrs = (s - mins) / 60;

  if (hrs > 0) {
    return hrs * 60 + mins + ":" + pad(secs);
  }

  return pad(mins) + ":" + pad(secs);
}

export function pad(n, z) {
  z = z || 2;
  return ("00" + n).slice(-z);
}

export async function resize(
  photo,
  heightUnder = 1000,
  widthUnder = 1000,
  extras = [],
) {
  if (photo.height > heightUnder && photo.width > widthUnder) {
    const newPhoto = await ImageManipulator.manipulateAsync(
      photo.uri,
      [
        {
          resize: {
            height: photo.height / 2,
            width: photo.width / 2,
          },
        },
        ...extras,
      ],
      { compress: 0.1, format: ImageManipulator.SaveFormat.PNG },
    );

    return resize(newPhoto, heightUnder, widthUnder);
  }

  return photo;
}
