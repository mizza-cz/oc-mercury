tablesWrap();
iframesWrap();
tableDecore();

// TABLE (wysiwyg editor) responsive
function tablesWrap() {
  var contentTables = document.querySelectorAll(".o-content table"),
    i;

  for (i = 0; i < contentTables.length; ++i) {
    contentTables[i].classList.add("table");

    var contentTableWrap = document.createElement("div");

    contentTableWrap.classList.add("table-responsive");

    contentTables[i].parentNode.insertBefore(
      contentTableWrap,
      contentTables[i]
    );

    contentTableWrap.appendChild(contentTables[i]);
  }
}
function tableDecore() {
  var contentRespons = document.querySelectorAll(
      ".o-content .table-responsive"
    ),
    i;
  for (i = 0; i < contentRespons.length; ++i) {
    contentRespons[i].classList.add("table-responsive");
    var contentResponsWrap = document.createElement("div");

    contentResponsWrap.classList.add("table-decore");
    contentRespons[i].parentNode.insertBefore(
      contentResponsWrap,
      contentRespons[i]
    );
    contentResponsWrap.appendChild(contentRespons[i]);
  }
}

// IFRAME youtube/google (wysiwyg editor) responsive
function iframesWrap() {
  var contentIframes = document.querySelectorAll(".o-content iframe"),
    i;

  for (i = 0; i < contentIframes.length; ++i) {
    contentIframes[i].removeAttribute("height");
    contentIframes[i].removeAttribute("width");

    var iframeWrap = document.createElement("div");
    iframeWrap.classList.add("ratio");
    iframeWrap.classList.add("ratio-16x9");

    contentIframes[i].parentNode.insertBefore(iframeWrap, contentIframes[i]);

    iframeWrap.appendChild(contentIframes[i]);
  }
}
