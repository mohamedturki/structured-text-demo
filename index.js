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

client.getEntries({include: 4, 'sys.id': entryId })
  .then((entries) => {
    entries.items.filter(entry => entry.sys.id === entryId).forEach(entry => {
      const renderOptions = {
        renderNode: {
          [BLOCKS.EMBEDDED_ENTRY]: (node) => {
            const entryId = node.data.target.sys.id;
            let entry = {};
            if (entries.includes) {
              entry = entries.includes.Entry.find(e => e.sys.id === entryId);
            } else {
              entry = entries.items.find(e => e.sys.id === entryId);
            }
            return `<code>${JSON.stringify(entry)}</code>`;
          } 
        }
      }
      console.log(documentToHtmlString(entry.fields.structuredContent, renderOptions))
    })
  })
  .catch(console.error)

