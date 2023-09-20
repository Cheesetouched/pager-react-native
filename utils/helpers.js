import * as ImageManipulator from "expo-image-manipulator";

export async function resize(photo, extras = []) {
  if (photo.height > 1000 && photo.width > 1000) {
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

    return resize(newPhoto);
  }

  return photo;
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
