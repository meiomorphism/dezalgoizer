(()=>{const e=window.getSelection();if(!e)return void alert("No text selected to dezalgoize!");const n=/[\u0300-\u036F]|[\u0483-\u0489]|[\u1AB0-\u1AFF]|[\u1DC0-\u1DFF]|[\u20D0-\u20FF]|[\u2DE0-\u2DFF]|[\uA66F-\uA67D]|\uA69E|\uA69F|[\uFE20-\uFE2F]/gu,o=[];for(const s of function*(){for(let n=0;n<e.rangeCount;++n)yield e.getRangeAt(n)}()){if(!s||s.collapsed)continue;function t(e,o,t){return e.slice(0,o)+e.slice(o,t).replace(n,"")+e.slice(t)}function u(e,n,o){e.nodeValue=t(e.nodeValue,n,o)}const e=s.startContainer,a=s.endContainer,d=s.startOffset,i=s.endOffset,c=null!=a.nodeValue?a.nodeValue.length-i:0;function*l(n){if(s.intersectsNode(n))if(n.nodeValue)yield[n,n===e?d:0,n===a?i:n.nodeValue.length];else for(let e of n.childNodes)yield*l(e)}for(const e of l(s.commonAncestorContainer))u(...e);const f=null!=a.nodeValue?a.nodeValue.length-c:i,r=new Range;r.setStart(e,d),r.setEnd(a,f),o.push(r)}e.removeAllRanges();for(const n of o)e.addRange(n)})();
