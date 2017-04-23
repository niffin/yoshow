(function () {

  function getUrlParams () {
    const queryParamString = location.search.replace('?', ''), // can also do .substring(1) but I feel like this is more explicit
          queryParamArray  = queryParamString.split('&');

    return queryParamArray.reduce((params, param) => {
      const prop = param.split('=')[0],
            val  = param.split('=')[1];

      params[prop] = val;

      return params;
    }, {});
  }

  function getNumberOfImagesFromUrl () {
    const param = parseInt(getUrlParams().imageCount, 10);
    return !isNaN(param) ? param : undefined;
  }

  window.yoshow.utils = {
    getUrlParams,
    getNumberOfImagesFromUrl
  };
})();
