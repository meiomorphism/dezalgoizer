(()=>{var e=window.getSelection();if(e){for(var n=[],t=0;t<e.rangeCount;++t){var a=e.getRangeAt(t);if(a&&!a.collapsed){var o=/[\u0300-\u036F]|[\u0483-\u0489]|[\u1DC0-\u1DFF]|[\u20D0-\u20FF]|[\uFE20-\uFE2F]/g,l=[],r=a.startContainer,u=a.endContainer,i=a.startOffset,s=a.endOffset,c=0;u.nodeValue&&(c=u.nodeValue.length-s),F(a.commonAncestorContainer),l.forEach((function(e){v.apply(this,e)}));var f=s;u.nodeValue&&(f=u.nodeValue.length-c);var d=new Range;d.setStart(r,i),d.setEnd(u,f),n.push(d)}function g(e){return e.replace(o,"")}function h(e,n,t){return t||(t=e.length),e.slice(0,n)+g(e.slice(n,t))+e.slice(t)}function v(e,n,t){e.nodeValue=h(e.nodeValue,n,t)}function F(e){if(e){if(a.intersectsNode(e))if(e.nodeValue){var n=[e,0,0];e==r&&(n[1]=i),e==u&&(n[2]=s),l.push(n)}else for(var t=e.firstChild;t;t=t.nextSibling)F(t)}else console.log("called with null")}}e.removeAllRanges(),n.forEach((function(n){e.addRange(n)}))}else alert("No text selected to dezalgoize!")})();
