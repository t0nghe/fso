(this.webpackJsonpphonebook=this.webpackJsonpphonebook||[]).push([[0],{22:function(e,t,n){},42:function(e,t,n){"use strict";n.r(t);var c=n(2),o=n.n(c),r=n(17),i=n.n(r),a=(n(22),n(8)),u=n(3),d=n(5),s=n.n(d),l="/api/persons",f=function(){return s.a.get(l).then((function(e){return e.data}))},j=function(e){return s.a.post(l,e).then((function(e){return e.data}))},b=function(e){return s.a.delete("".concat(l,"/").concat(e)).then((function(e){return e.data}))},h=function(e,t){return s.a.put("".concat(l,"/").concat(e),t).then((function(e){return e.data}))},O=n(0),p=function(e){var t=Object(c.useState)(""),n=Object(u.a)(t,2),o=n[0],r=n[1];return Object(O.jsxs)("div",{children:["Filter shown with ",Object(O.jsx)("input",{value:o,onChange:function(t){r(t.target.value),e.handleFilterBy(t.target.value)}})]})},m=function(e){var t=Object(c.useState)(""),n=Object(u.a)(t,2),o=n[0],r=n[1],i=Object(c.useState)(""),a=Object(u.a)(i,2),d=a[0],s=a[1];return Object(O.jsxs)("div",{children:["name: ",Object(O.jsx)("input",{value:o,onChange:function(e){r(e.target.value)}}),Object(O.jsx)("br",{}),"number: ",Object(O.jsx)("input",{value:d,onChange:function(e){s(e.target.value)}}),Object(O.jsx)("br",{}),Object(O.jsx)("button",{onClick:function(){(function(){if(o&&d){var t={name:o,number:d};return e.handleAdd(t),!0}return!1})()&&(r(""),s(""))},children:"add"})]})},x=function(e){var t,n=e.filterBy.toLowerCase();return t=e.allPeople.filter((function(e){return e.name.toLowerCase().includes(n)})),Object(O.jsx)("ul",{children:t.map((function(t){return Object(O.jsxs)("li",{children:[t.name," ",t.number," ",Object(O.jsx)("button",{onClick:function(){e.handleDeletion(t.id,t.name)},children:"delete"})]},t.name+t.number)}))})},v=function(e){return Object(O.jsx)("div",{style:e.info[1],children:e.info[0]})},g=function(){var e={color:"red",background:"lightgrey",fontSize:"20px",borderStyle:"solid",borderRadius:"5px",padding:"10px",marginBottom:"10px"},t={color:"green",background:"lightgrey",fontSize:"20px",borderStyle:"solid",borderRadius:"5px",padding:"10px",marginBottom:"10px"},n={display:"none"},o=Object(c.useState)([]),r=Object(u.a)(o,2),i=r[0],d=r[1],s=Object(c.useState)(""),l=Object(u.a)(s,2),g=l[0],w=l[1],y=Object(c.useState)(["",n]),S=Object(u.a)(y,2),k=S[0],B=S[1];Object(c.useEffect)((function(){f().then((function(e){d(e)}))}),[]);return Object(O.jsxs)("div",{children:[Object(O.jsx)("h2",{children:"Phonebook"}),Object(O.jsx)(v,{info:k}),Object(O.jsx)(p,{handleFilterBy:w}),Object(O.jsx)("h3",{children:"Add a new"}),Object(O.jsx)(m,{handleAdd:function(c){var o=i.filter((function(e){return e.name===c.name}));0===o.length?j(c).then((function(e){d([].concat(Object(a.a)(i),[e])),B(["Record of ".concat(e.name," is added."),t]),setTimeout((function(){B(["",n])}),5e3)})).catch((function(t){var c=t.response.data.error;B([c,e]),setTimeout((function(){B(["",n])}),5e3)})):window.confirm("".concat(o[0].name," exists. Update?"))&&h(o[0].id,c).then((function(e){var c=i.filter((function(t){return t.id!==e.id}));d([].concat(Object(a.a)(c),[e])),B(["Record of ".concat(e.name," is updated."),t]),setTimeout((function(){B(["",n])}),5e3)})).catch((function(t){var c=t.response.data.error;B([c,e]),setTimeout((function(){B(["",n])}),5e3)}))}}),Object(O.jsx)("h3",{children:"Numbers"}),Object(O.jsx)(x,{filterBy:g,allPeople:i,handleDeletion:function(c,o){window.confirm("Delete ".concat(o,"?"))&&b(c).then((function(e){d(i.filter((function(e){return e.id!==c})));var r="Record of ".concat(o," is deleted.");B([r,t]),setTimeout((function(){B(["",n])}),5e3)})).catch((function(t){d(i.filter((function(e){return e.id!==c})));var o=t.response.data.error;B([o,e]),setTimeout((function(){B(["",n])}),5e3)}))}})]})};i.a.render(Object(O.jsx)(o.a.StrictMode,{children:Object(O.jsx)(g,{})}),document.getElementById("root"))}},[[42,1,2]]]);
//# sourceMappingURL=main.26d18d09.chunk.js.map