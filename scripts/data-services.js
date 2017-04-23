/**
 * NOTE --
 * Implicit dependency on constants.js
 */
(function ({ constants }) {

  function getImageDataFrom (imageAPI, imagesUrl) {
    return fetch(imagesUrl) 
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res.json();
      })
      .then(json => {
        try {
          switch (imageAPI) {
            case constants.IMAGE_APIS.FLICKR :
              if (json.stat !== 'ok') {
                throw Error(json.message);
              }
              return json.photoset.photo.map(extractFlickrImageData);
            default :
              alert('This image API (' + imageAPI + ') is not supported at this time. Maybe one day?');
              return [];
          }
        } catch (e) {
          alert('Uh oh, looks like Flikr changed the shape of their API response! \nOr maybe the API key went bad? \nOr maybe the imageCount query param is too large? \n\nThe possibilities are endless... \n\n Anyhow, here\'s the error - ' + e);
          return [];
        }
      })
      .catch(err => alert(err + '\n\n url - ' + imagesUrl));
  }

  function extractFlickrImageData (rawImageAPIResponse) {
    try {
      return {
        title : rawImageAPIResponse.title,
        src   : `https://farm${ rawImageAPIResponse.farm }.staticflickr.com/${ rawImageAPIResponse.server }/${ rawImageAPIResponse.id }_${ rawImageAPIResponse.secret }.jpg`
      };
    } catch (e) {
      console.warn('Couldn\'t extract the URL from ', rawImageAPIResponse);
      return {};
    }
  }

  window.yoshow.dataServices = {
    getImageDataFrom
  };
})({
  constants : window.yoshow.constants
});
