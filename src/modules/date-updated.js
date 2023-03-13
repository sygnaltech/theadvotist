
import { WfuCache, WfuCacheItem } from 'https://cdn.jsdelivr.net/gh/sygnaltech/webflow-util@4.11/src/modules/webflow-cache.js'; 

// Update the header today date 
// when the DOM is ready
/*
document.addEventListener("DOMContentLoaded", function() { 
	// get the the span element
	const yrSpan = document.querySelector('.todaysdate');
  // get the day and months
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	// get the current date
  const d = new Date();
  let newDate = month[d.getMonth()]+' '+d.getDate() +', '+ d.getFullYear();
  // set the date span element's text to the current date
  console.log (newDate); // must not use = here 
  yrSpan.textContent = newDate;
});
*/

$(function() {
  
  const cache = new WfuCache({
 
    val: {
      updated: new WfuCacheItem({
        store: "sessionStorage", 
        name: "updated", 
        updateFnAsync: getUpdatedAsync   
      }),
      today: new WfuCacheItem({
        store: "sessionStorage", 
        name: "today", 
        updateFnAsync: getTodayAsync   
      })
    }

  });

  // Load and apply today's date 
  cache.getAsync("today")
    .then(x => { 
      
      if (x) {
        $("[bind-cache='todays-date']").text(`${x}`); 
      }
      
    });

  // Load and apply last updated date  
  cache.getAsync("updated")
    .then(x => { 
      
      if (x) {
        $("[bind-cache='updated-date']").text(`UPDATED: ${x}`); 
      }
    
    });
  
});

// Determine and format today's date  
async function getTodayAsync() {

  // get the day and months
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  
	// get the current date
  const d = new Date();
  
  let newDate = `${month[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  
  return newDate;
} 

// Determine and format the last updated date 
async function getUpdatedAsync() {
  
  // Starting min date 
  // 1-month ago ( safety ) 
  var d = new Date();
  d = d.setMonth(d.getMonth() - 1);

  var data = await $.get(`/data/updated`).done(d => {
    return d;
  }); 
    
  data = $.parseHTML(data);
  
  await $(data).find('data').each(function() {
    var d2 = new Date($(this).attr('date')); 
    if (d2 > d) d = d2;  
  });

  let f = new Intl.DateTimeFormat('en', {
    day: "numeric",
    month : "numeric",
    year: "2-digit",
  }).format(d);

  return f;
}

