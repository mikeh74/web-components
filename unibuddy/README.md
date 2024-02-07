# Example unibuddy components

These are examples of unibuddy widgets implemented with lazy loading techniques

We are delaying the load of the popup by listening for the on load event and then using a scroll listener to load the script when the first scroll event is triggered.

## Default unibuddy component

Tasks:
* create a placeholder element that we can append the iframe to in the page
* create function to inject iframe into the page where required
* create function to load script element (this should only be loaded once)
* create an intersection observer that can listen for an element entering the viewport (will need to start loading before the element reaches the viewport)
* wire up the placeholder elements to the intersection observer and then trigger the load even when the element is intersecting

Origin snippet:

```
<iframe loading="lazy" data-ub-cookie-consent="necessary"
  id="unibuddy-iframe" scrolling="no"
  src=https://unibuddy.co/embed/ucen-manchester/colour/204c82
  title="Unibuddy" width="100%">
</iframe>

<script src=https://cdn.unibuddy.co/unibuddy-iframe.js type="text/javascript">
</script>

```

We need to load both of these elements via script to stop the page having to load the resources during the initial page load event.
