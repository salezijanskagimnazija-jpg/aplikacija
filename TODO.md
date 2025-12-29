# TODO

## Refactor

[scrape.js](./src/js/scrape.js) needs refactoring. It is really messy. There is a lot of redundant code, especially with the generation of options.

## Login and hosting

### Popups or Redirect

Need to decide on whether to use popups at all. Redirect should work on all platforms but it requires using firebase hosting and the *.firebaseapp.com domain, to avoid proxying complexity.

### Email or no email auth

Also need to decide whether to use auth with email at all, chances are 99% of users will have either google or apple accounts.

## Scraping

### Approach

Maybe need to change approach. Instead of a json that attempts to mimic and organize the data they hold. We could mimic all of their API calls, since they use AJAX calls for virtually everything.

### Access

Need to add a link to the page somewhere on the main page.

### Display

Need to display the results of the scrape.

### Filtering

Need to complete the filtering, so far can only filter by vrsta ucilista. Need to add support for filtering by uciliste, sastavnica, mjesto...

### Other Websites

So far, only postani-student.hr and it's fakulteti was scraped. Need to try scraping other sites like e-rudnik.

## Styling

Need to work on styling, so far only rudimentary and thoughtless styling was addedd. Especially things like the user-info on the main page. Or the search and filtering on the scrape page.
