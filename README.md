# Mermaid JS ER Diagram to SQL converter

[Mermaid](https://mermaid.js.org/) is Javascript diagramming and charting tool.

This VSCode extension converts [MermaidJS Entity Relationship markdown ](https://mermaid.js.org/syntax/entityRelationshipDiagram.html) to SQL.

.md, .mermaid and .mmd files are currently supported.

---

## Features

- Generate SQL code for MySQL, SQLite and Postgres (might work with other DBMS as well) from Mermaid markdown
- Composite primary and foreign key support
- Automatic Foreign key generation from relationships definition, without the need to define FK in ER diagram
- Most data types supported (SET and ENUM are not accepted by Mermaid)

![Usage](demos/mermaidERDToSQL.gif)

> Open a valid Mermaid ER diagram file, search the command palette for "Mermaid ERD to SQL". 
The generated file will be in the same folder as the converted file.

If the basic SQL does not work with your DBMS, you can try the specific Postgres, MySQL or SQLite commands.

---

## Documentation

See the [Wiki on Github](https://github.com/erralb/mermaid-js-erd-to-sql/wiki) 

---

## Release Notes

See the [Change log](CHANGELOG.md) 

---

## Issues & Suggestions

Please feel free to open issues and suggest features or pull requests on [Github](https://github.com/erralb/mermaid-js-erd-to-sql)

---

## Recommended extensions

To edit and preview Mermaid mardown files, I personnaly use these extensions :

- [Markdown Preview Enhanced](https://marketplace.visualstudio.com/items?itemName=shd101wyy.markdown-preview-enhanced) or [Markdown Preview Mermaid Support](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid)
- [Mermaid syntax highlighting](https://marketplace.visualstudio.com/items?itemName=bpruitt-goddard.mermaid-markdown-syntax-highlighting)

---

## Enjoy!
