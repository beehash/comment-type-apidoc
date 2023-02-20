window.onload = function() {
  //<editor-fold desc="Changeable Configuration Block">
  // const decodeUrl = decodeURIComponent(location.href);
  // const { id } = decodeUrl.searchParams || {};
  // fetch(`https://newbase.zhihuishu.com/comm/listByDocIds?docIds=8119756`, {mode: 'cors',}).then(res => {
  //   return res.json();
  // }).then(res => {
  //   // if(res.successful)
  //   if(res.successful) {
  //     const fileInfo = Array.isArray(res.result) ? res.result[0] : [];
  //     if(fileInfo && fileInfo.storage) {
  //       renderUI(fileInfo.storage);
  //     }
  //   }
    
  //   // renderUI()
  // });
  // 'https://file.zhihuishu.com/zhs_yufa_150820/ablecommons/uploadimage/202302/7e5c2b9a0bbd4dceb89798c53adfbf69.json',// jsonurl, // 
  const pagename = '';
  renderUI()
  function renderUI(jsonurl) {
    window.ui = SwaggerUIBundle({
      url: '../jsons/'+(pagename ? pagename : 'default')+'.json',
      dom_id: '#swagger-ui',
      deepLinking: true,
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIStandalonePreset
      ],
      validatorUrl: false,
      plugins: [
        SwaggerUIBundle.plugins.DownloadUrl
      ],
      layout: "StandaloneLayout"
    });
  }
  // the following lines will be replaced by docker/configurator, when it runs in a docker-container
  

  //</editor-fold>
};
