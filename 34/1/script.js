const getPdfjs = async () => {
  const version = "4.0"
  const lib = await import(`https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/+esm`);
  lib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.mjs`;
  return lib;
}

function renderPDF(pdfjs, url, container, options) {
  const renderPages = (pdf) => {
    if (!pdf) return

    for (let page = 1; page <= pdf.numPages; page++) {
      pdf.getPage(page).then(function (page) {
        const viewport = page.getViewport({ scale: 2 })
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")

        canvas.height = viewport.height
        canvas.width = viewport.width
        container.appendChild(canvas)

        if (context) {
          renderTask = page.render({
            canvasContext: context,
            viewport,
          });
        }
      });
    }
    return renderTask?.promise
  };

  const loadDocument = async () => {
    try {
      const loadingTask = await pdfjs.getDocument(url)
      return loadingTask?.promise.then(renderPages)
    } catch (error) {
      throw error
    }
  }
  loadDocument()
}  

getPdfjs().then((pdfjs) => {
  const url = "34/India and It's Scams.pdf"
  const container = document.getElementById("pdf-viewer")
  renderPDF(pdfjs, url, container)
})
