const contentful = require('contentful')
const {documentToHtmlString} = require('@contentful/structured-text-html-serializer')
const {BLOCKS} = require('@contentful/structured-text-types')

const accessToken = ''
const space = ''
const entryId = ''

const renderOptions = {
  renderNode: {
    [BLOCKS.EMBEDDED_ENTRY]: (node) => `<code>${JSON.stringify(node, null, 2)}</code>`
  }
}

const client = contentful.createClient({
  space,
  accessToken
})

// Use the collection endpoint but fetch only the
// entry(ies) that you want to render.
client.getEntries({include: 4, 'sys.id': entryId })
  .then((entries) => {
    const renderOptions = {
      renderNode: {
        [BLOCKS.EMBEDDED_ENTRY]: (node) => {
          const entryId = node.data.target.sys.id;
          let entry = {};
          // look for the resolved entries either in the `includes` field
          // (if it was part of the `.items`) 
          if (entries.includes) {
            entry = entries.includes.Entry.find(e => e.sys.id === entryId);

          // or in the `.items` if it was returned as part of the queried entries.
          } else {
            entry = entries.items.find(e => e.sys.id === entryId);
          }
          return `<code>${JSON.stringify(entry)}</code>`;
        }
      }
    }
    entries.items.filter(entry => entry.sys.id === entryId).forEach(entry => {
      // Here `structuredContent` is the name of the structured field in my content model
      console.log(documentToHtmlString(entry.fields.structuredContent, renderOptions))
    })
  })
  .catch(console.error)

