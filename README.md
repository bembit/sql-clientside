### TEST; SQL Query Builder / table analyser in Node.js / vanilla

### The main idea would be to connect it to any sql database and do stuff.

- definitely sounded easier in concept than it actually is while building it.
- good for a demo, or a tool to help people learn sql. would rewrite in typescript / react or something.
- has some python scripts to create a database and populate it with data.

### todo

A validation would be great so we couldn't spam empty SELECT * queries.

- [ ] add order by default _id ?

- [x] added lots of UI shit as usual

- [ ] import should validate IDs, and ignore if they are already in localstorage

- [ ] rewrite everything localstorage based to sqlite, or just have the possibility

- [x] resolve initial selected table not showing columns

- [x] added user options and confirmation dialog

- [x] add an interface, maybe tabbed, or nav bar

- [ ] queries dropdown for last 15 entries

- [x] add DISTINCT toggle

- [x] add COUNT(*) toggle

- [x] can add limit

- [x] add option to select columns from joined tables ...

- [ ] on modal close, set searchbar to empty? or don't?

- [ ] copy to clipboard button for query.

- [x] export to csv button functions 

- [x] expand on table analyser, more details, first few rows, etc

- [ ] clean up messy code and refactor, structure, and comments

- [x] need import comments too

- [x] EDIT COMMENTS

- [x] ok, add DBs now.

- [x] then do editor.

- [x] add a count to the end results

- [ ] double click to edit is shit

- [ ] write some gpt queries to test joins

- [ ] add a button to clear the query builder

- [ ] make query editable and copyable...

- [x] start the db editor, migrator

- [x] expand joins to dropdown multi joins.

### failed / discarded for demo

- [ ] save the entire query state to local storage so we can load them later as an editable form