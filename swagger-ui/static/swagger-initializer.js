window.onload = function() {
  //<editor-fold desc="Changeable Configuration Block">
  const decodeUrl = decodeURIComponent(location.href);
  const { projectname, pagename } = decodeUrl.searchParams;
  // the following lines will be replaced by docker/configurator, when it runs in a docker-container
  window.ui = SwaggerUIBundle({
    url: '../jsons/'+(projectname ? projectname : 'default')+(pagename ? pagename : 'swagger')+'.json',
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  });

  //</editor-fold>
};
