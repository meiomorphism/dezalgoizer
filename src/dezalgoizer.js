(function(){
  var NO_SEL = "No text selected to dezalgoize!";

  // Get the range object. (Currently FF-only.)
  var sel = window.getSelection();
  if (!sel) { alert(NO_SEL); return; }
  var newRanges = [];
  for (var selIx = 0; selIx < sel.rangeCount; ++selIx) {
    var s = sel.getRangeAt(selIx);
    if (!s || s.collapsed) continue;

    // Match all combining characters in the Basic Multilingual Plane.
    //
    // (This omits the combining musical characters in the SMP: FF 26
    // strips actual text if they're included. They also aren't yet
    // widely supported, so there's probably no need to worry about
    // them.)
    var CCs=/[\u0300-\u036F]|[\u0483-\u0489]|[\u1DC0-\u1DFF]|[\u20D0-\u20FF]|[\uFE20-\uFE2F]/g;

    // Strip all combining characters from a string, returning it.
    function rr(T) { return T.replace(CCs,""); }
    // Strip all combining characters from a particular substring [a,b)
    // of a string.
    function r(T,a,b) {
      if (!b) b=T.length;
      return T.slice(0,a)+rr(T.slice(a,b))+T.slice(b);
    }
    // Strip all combining characters from a particular substring [a,b)
    // of a text-node's contents.
    function f(N,a,b) { N.nodeValue = r(N.nodeValue,a,b); }

    // Accumulator: collection of selected text nodes to edit, along with
    // their selected region.
    var nodes = [];
    // Shorthand aliases, yes, but also save the selection state
    // for later restoration.
    var NS=s.startContainer;
    var NE=s.endContainer;
    var OS=s.startOffset;
    var OE=s.endOffset;
    // End co-offset. For string nodes, the last few characters will be
    // unchanged, so we count backwards from the end both times.
    var OcE = 0;
    if (NE.nodeValue) OcE = NE.nodeValue.length - OE;

    // Accumulation function. We start at a local root and work our way down,
    // discarding any irrelevant subtrees.
    function SNs(N) {
      if (!N) {console.log("called with null"); return;}
      if (!s.intersectsNode(N)) return;
      if (N.nodeValue) {
        var delim = [N, 0, 0];
        if (N==NS) delim[1] = OS;
        if (N==NE) delim[2] = OE;
        nodes.push(delim);
      } else {
        for (var C=N.firstChild;C;C=C.nextSibling) SNs(C);
      }
    }

    // Run over all the nodes starting from a convenient root...
    SNs(s.commonAncestorContainer);
    // ... then alter each of the discovered text nodes in-place.
    nodes.forEach(function(a){f.apply(this,a)});

    // Calculate the new end-offset...
    var OE2 = OE; if (NE.nodeValue) OE2 = NE.nodeValue.length - OcE;
    // ... and save off the selection, to be restored once we've been
    // through all the subselections. (This does assume that selection-
    // ranges can't overlap.)
    var newRange = new Range();
    newRange.setStart(NS, OS);
    newRange.setEnd(NE, OE2);
    newRanges.push(newRange);
  }

  // Restore selections.
  sel.removeAllRanges();
  newRanges.forEach(function(r){sel.addRange(r)});
})();
