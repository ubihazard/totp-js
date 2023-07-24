/*
 * File combining 
 * (1) sha.js by Brian Turek 2008-2013 under BSD license
 * (2) and a modified js OTP implementation found on JSFiddle
*/
(function(){var a,b;b=function(){function a(a,b){if(this.expiry=null!=a?a:30,this.length=null!=b?b:6,this.length>8||this.length<6)throw"Error: invalid code length"}return a.prototype.dec2hex=function(a){return(15.5>a?"0":"")+Math.round(a).toString(16)},a.prototype.hex2dec=function(a){return parseInt(a,16)},a.prototype.base32tohex=function(a){var b,c,d,e,f,g;for(b="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",c="",e="",f=0;f<a.length;)g=b.indexOf(a.charAt(f).toUpperCase()),c+=this.leftpad(g.toString(2),5,"0"),f++;for(f=0;f+4<=c.length;)d=c.substr(f,4),e+=parseInt(d,2).toString(16),f+=4;return e},a.prototype.leftpad=function(a,b,c){return b+1>=a.length&&(a=Array(b+1-a.length).join(c)+a),a},a.prototype.getOtp=function(a,b){var c,d,e,f,g,h,i;if(null==b&&(b=(new Date).getTime()),e=this.base32tohex(a),c=Math.round(b/1e3),i=this.leftpad(this.dec2hex(Math.floor(c/this.expiry)),16,"0"),h=new jsSHA("SHA-1","HEX"),h.setHMACKey(e,"HEX"),h.update(i),d=h.getHMAC("HEX"),"KEY MUST BE IN BYTE INCREMENTS"===d)throw"Error: hex key must be in byte increments";return f=this.hex2dec(d.substring(d.length-1)),g=(this.hex2dec(d.substr(2*f,8))&this.hex2dec("7fffffff"))+"",g=g.substr(g.length-this.length,this.length)},a}(),a=function(){function a(a){if(this.length=null!=a?a:6,this.length>8||this.length<6)throw"Error: invalid code length"}return a.prototype.uintToString=function(a){var b,c;return c=String.fromCharCode.apply(null,a),b=decodeURIComponent(escape(c))},a.prototype.getOtp=function(a,b){var c,d,e,f,g;return f=new jsSHA("SHA-1","TEXT"),f.setHMACKey(a,"TEXT"),f.update(this.uintToString(new Uint8Array(this.intToBytes(b)))),c=f.getHMAC("HEX"),d=this.hexToBytes(c),e=15&d[19],g=(127&d[e])<<24|(255&d[e+1])<<16|(255&d[e+2])<<8|255&d[e+3],g+="",g.substr(g.length-this.length,this.length)},a.prototype.intToBytes=function(a){var b,c;for(b=[],c=7;c>=0;)b[c]=255&a,a>>=8,--c;return b},a.prototype.hexToBytes=function(a){var b,c,d;for(c=[],d=0,b=a.length;b>d;)c.push(parseInt(a.substr(d,2),16)),d+=2;return c},a}(),window.jsOTP={},jsOTP.totp=b,jsOTP.hotp=a}).call(this);var SUPPORTED_ALGS=7;!function(a){"use strict";function b(a,b){this.highOrder=a,this.lowOrder=b}function c(a,b,c,d){var e,f,g,h,i,j,k=[],l=[],m=0;if(k=c||[0],d=d||0,h=d>>>3,"UTF8"===b)for(f=0;f<a.length;f+=1)for(e=a.charCodeAt(f),l=[],128>e?l.push(e):2048>e?(l.push(192|e>>>6),l.push(128|63&e)):55296>e||e>=57344?l.push(224|e>>>12,128|e>>>6&63,128|63&e):(f+=1,e=65536+((1023&e)<<10|1023&a.charCodeAt(f)),l.push(240|e>>>18,128|e>>>12&63,128|e>>>6&63,128|63&e)),g=0;g<l.length;g+=1){for(j=m+h,i=j>>>2;k.length<=i;)k.push(0);k[i]|=l[g]<<8*(3-j%4),m+=1}else if("UTF16BE"===b||"UTF16LE"===b)for(f=0;f<a.length;f+=1){for(e=a.charCodeAt(f),"UTF16LE"===b&&(g=255&e,e=g<<8|e>>>8),j=m+h,i=j>>>2;k.length<=i;)k.push(0);k[i]|=e<<8*(2-j%4),m+=2}return{value:k,binLen:8*m+d}}function d(a,b,c){var d,e,f,g,h,i,j=a.length;if(d=b||[0],c=c||0,i=c>>>3,0!==j%2)throw new Error("String of HEX type must be in byte increments");for(e=0;j>e;e+=2){if(f=parseInt(a.substr(e,2),16),isNaN(f))throw new Error("String of HEX type contains invalid characters");for(h=(e>>>1)+i,g=h>>>2;d.length<=g;)d.push(0);d[g]|=f<<8*(3-h%4)}return{value:d,binLen:4*j+c}}function e(a,b,c){var d,e,f,g,h,i=[];for(i=b||[0],c=c||0,f=c>>>3,e=0;e<a.length;e+=1)d=a.charCodeAt(e),h=e+f,g=h>>>2,i.length<=g&&i.push(0),i[g]|=d<<8*(3-h%4);return{value:i,binLen:8*a.length+c}}function f(a,b,c){var d,e,f,g,h,i,j,k,l,m=[],n=0,o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";if(m=b||[0],c=c||0,j=c>>>3,-1===a.search(/^[a-zA-Z0-9=+\/]+$/))throw new Error("Invalid character in base-64 string");if(i=a.indexOf("="),a=a.replace(/\=/g,""),-1!==i&&i<a.length)throw new Error("Invalid '=' found in base-64 string");for(e=0;e<a.length;e+=4){for(h=a.substr(e,4),g=0,f=0;f<h.length;f+=1)d=o.indexOf(h[f]),g|=d<<18-6*f;for(f=0;f<h.length-1;f+=1){for(l=n+j,k=l>>>2;m.length<=k;)m.push(0);m[k]|=(g>>>16-8*f&255)<<8*(3-l%4),n+=1}}return{value:m,binLen:8*n+c}}function g(a,b){var c,d,e="0123456789abcdef",f="",g=4*a.length;for(c=0;g>c;c+=1)d=a[c>>>2]>>>8*(3-c%4),f+=e.charAt(d>>>4&15)+e.charAt(15&d);return b.outputUpper?f.toUpperCase():f}function h(a,b){var c,d,e,f,g,h,i="",j=4*a.length,k="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";for(c=0;j>c;c+=3)for(f=c+1>>>2,g=a.length<=f?0:a[f],f=c+2>>>2,h=a.length<=f?0:a[f],e=(a[c>>>2]>>>8*(3-c%4)&255)<<16|(g>>>8*(3-(c+1)%4)&255)<<8|h>>>8*(3-(c+2)%4)&255,d=0;4>d;d+=1)i+=8*c+6*d<=32*a.length?k.charAt(e>>>6*(3-d)&63):b.b64Pad;return i}function i(a){var b,c,d="",e=4*a.length;for(b=0;e>b;b+=1)c=a[b>>>2]>>>8*(3-b%4)&255,d+=String.fromCharCode(c);return d}function j(a){var b,c={outputUpper:!1,b64Pad:"="};if(b=a||{},c.outputUpper=b.outputUpper||!1,c.b64Pad=b.b64Pad||"=","boolean"!=typeof c.outputUpper)throw new Error("Invalid outputUpper formatting option");if("string"!=typeof c.b64Pad)throw new Error("Invalid b64Pad formatting option");return c}function k(a,b){var g;switch(b){case"UTF8":case"UTF16BE":case"UTF16LE":break;default:throw new Error("encoding must be UTF8, UTF16BE, or UTF16LE")}switch(a){case"HEX":g=d;break;case"TEXT":g=function(a,d,e){return c(a,b,d,e)};break;case"B64":g=f;break;case"BYTES":g=e;break;default:throw new Error("format must be HEX, TEXT, B64, or BYTES")}return g}function l(a,b){return a<<b|a>>>32-b}function m(a,b){return a>>>b|a<<32-b}function n(a,c){var d=null,e=new b(a.highOrder,a.lowOrder);return d=32>=c?new b(e.highOrder>>>c|e.lowOrder<<32-c&4294967295,e.lowOrder>>>c|e.highOrder<<32-c&4294967295):new b(e.lowOrder>>>c-32|e.highOrder<<64-c&4294967295,e.highOrder>>>c-32|e.lowOrder<<64-c&4294967295)}function o(a,b){return a>>>b}function p(a,c){var d=null;return d=32>=c?new b(a.highOrder>>>c,a.lowOrder>>>c|a.highOrder<<32-c&4294967295):new b(0,a.highOrder>>>c-32)}function q(a,b,c){return a^b^c}function r(a,b,c){return a&b^~a&c}function s(a,c,d){return new b(a.highOrder&c.highOrder^~a.highOrder&d.highOrder,a.lowOrder&c.lowOrder^~a.lowOrder&d.lowOrder)}function t(a,b,c){return a&b^a&c^b&c}function u(a,c,d){return new b(a.highOrder&c.highOrder^a.highOrder&d.highOrder^c.highOrder&d.highOrder,a.lowOrder&c.lowOrder^a.lowOrder&d.lowOrder^c.lowOrder&d.lowOrder)}function v(a){return m(a,2)^m(a,13)^m(a,22)}function w(a){var c=n(a,28),d=n(a,34),e=n(a,39);return new b(c.highOrder^d.highOrder^e.highOrder,c.lowOrder^d.lowOrder^e.lowOrder)}function x(a){return m(a,6)^m(a,11)^m(a,25)}function y(a){var c=n(a,14),d=n(a,18),e=n(a,41);return new b(c.highOrder^d.highOrder^e.highOrder,c.lowOrder^d.lowOrder^e.lowOrder)}function z(a){return m(a,7)^m(a,18)^o(a,3)}function A(a){var c=n(a,1),d=n(a,8),e=p(a,7);return new b(c.highOrder^d.highOrder^e.highOrder,c.lowOrder^d.lowOrder^e.lowOrder)}function B(a){return m(a,17)^m(a,19)^o(a,10)}function C(a){var c=n(a,19),d=n(a,61),e=p(a,6);return new b(c.highOrder^d.highOrder^e.highOrder,c.lowOrder^d.lowOrder^e.lowOrder)}function D(a,b){var c=(65535&a)+(65535&b),d=(a>>>16)+(b>>>16)+(c>>>16);return(65535&d)<<16|65535&c}function E(a,b,c,d){var e=(65535&a)+(65535&b)+(65535&c)+(65535&d),f=(a>>>16)+(b>>>16)+(c>>>16)+(d>>>16)+(e>>>16);return(65535&f)<<16|65535&e}function F(a,b,c,d,e){var f=(65535&a)+(65535&b)+(65535&c)+(65535&d)+(65535&e),g=(a>>>16)+(b>>>16)+(c>>>16)+(d>>>16)+(e>>>16)+(f>>>16);return(65535&g)<<16|65535&f}function G(a,c){var d,e,f,g;return d=(65535&a.lowOrder)+(65535&c.lowOrder),e=(a.lowOrder>>>16)+(c.lowOrder>>>16)+(d>>>16),f=(65535&e)<<16|65535&d,d=(65535&a.highOrder)+(65535&c.highOrder)+(e>>>16),e=(a.highOrder>>>16)+(c.highOrder>>>16)+(d>>>16),g=(65535&e)<<16|65535&d,new b(g,f)}function H(a,c,d,e){var f,g,h,i;return f=(65535&a.lowOrder)+(65535&c.lowOrder)+(65535&d.lowOrder)+(65535&e.lowOrder),g=(a.lowOrder>>>16)+(c.lowOrder>>>16)+(d.lowOrder>>>16)+(e.lowOrder>>>16)+(f>>>16),h=(65535&g)<<16|65535&f,f=(65535&a.highOrder)+(65535&c.highOrder)+(65535&d.highOrder)+(65535&e.highOrder)+(g>>>16),g=(a.highOrder>>>16)+(c.highOrder>>>16)+(d.highOrder>>>16)+(e.highOrder>>>16)+(f>>>16),i=(65535&g)<<16|65535&f,new b(i,h)}function I(a,c,d,e,f){var g,h,i,j;return g=(65535&a.lowOrder)+(65535&c.lowOrder)+(65535&d.lowOrder)+(65535&e.lowOrder)+(65535&f.lowOrder),h=(a.lowOrder>>>16)+(c.lowOrder>>>16)+(d.lowOrder>>>16)+(e.lowOrder>>>16)+(f.lowOrder>>>16)+(g>>>16),i=(65535&h)<<16|65535&g,g=(65535&a.highOrder)+(65535&c.highOrder)+(65535&d.highOrder)+(65535&e.highOrder)+(65535&f.highOrder)+(h>>>16),h=(a.highOrder>>>16)+(c.highOrder>>>16)+(d.highOrder>>>16)+(e.highOrder>>>16)+(f.highOrder>>>16)+(g>>>16),j=(65535&h)<<16|65535&g,new b(j,i)}function J(a){var c,d,e;if("SHA-1"===a&&1&SUPPORTED_ALGS)c=[1732584193,4023233417,2562383102,271733878,3285377520];else{if(!(6&SUPPORTED_ALGS))throw new Error("No SHA variants supported");switch(d=[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428],e=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],a){case"SHA-224":c=d;break;case"SHA-256":c=e;break;case"SHA-384":c=[new b(3418070365,d[0]),new b(1654270250,d[1]),new b(2438529370,d[2]),new b(355462360,d[3]),new b(1731405415,d[4]),new b(41048885895,d[5]),new b(3675008525,d[6]),new b(1203062813,d[7])];break;case"SHA-512":c=[new b(e[0],4089235720),new b(e[1],2227873595),new b(e[2],4271175723),new b(e[3],1595750129),new b(e[4],2917565137),new b(e[5],725511199),new b(e[6],4215389547),new b(e[7],327033209)];break;default:throw new Error("Unknown SHA variant")}}return c}function K(a,b){var c,d,e,f,g,h,i,j=[],k=r,m=q,n=t,o=l,p=D,s=F;for(c=b[0],d=b[1],e=b[2],f=b[3],g=b[4],i=0;80>i;i+=1)16>i?j[i]=a[i]:j[i]=o(j[i-3]^j[i-8]^j[i-14]^j[i-16],1),h=20>i?s(o(c,5),k(d,e,f),g,1518500249,j[i]):40>i?s(o(c,5),m(d,e,f),g,1859775393,j[i]):60>i?s(o(c,5),n(d,e,f),g,2400959708,j[i]):s(o(c,5),m(d,e,f),g,3395469782,j[i]),g=f,f=e,e=o(d,30),d=c,c=h;return b[0]=p(c,b[0]),b[1]=p(d,b[1]),b[2]=p(e,b[2]),b[3]=p(f,b[3]),b[4]=p(g,b[4]),b}function L(a,b,c,d){var e,f,g;for(g=(b+65>>>9<<4)+15;a.length<=g;)a.push(0);for(a[b>>>5]|=128<<24-b%32,a[g]=b+c,f=a.length,e=0;f>e;e+=16)d=K(a.slice(e,e+16),d);return d}function M(a,c,d){var e,f,g,h,i,j,k,l,m,n,o,p,q,J,K,L,M,N,Q,R,S,T,U,V,W,X,Y,Z=[];if(("SHA-224"===d||"SHA-256"===d)&&2&SUPPORTED_ALGS)o=64,q=1,U=Number,J=D,K=E,L=F,M=z,N=B,Q=v,R=x,T=t,S=r,Y=O;else{if("SHA-384"!==d&&"SHA-512"!==d||!(4&SUPPORTED_ALGS))throw new Error("Unexpected error in SHA-2 implementation");o=80,q=2,U=b,J=G,K=H,L=I,M=A,N=C,Q=w,R=y,T=u,S=s,Y=P}for(e=c[0],f=c[1],g=c[2],h=c[3],i=c[4],j=c[5],k=c[6],l=c[7],p=0;o>p;p+=1)16>p?(X=p*q,V=a.length<=X?0:a[X],W=a.length<=X+1?0:a[X+1],Z[p]=new U(V,W)):Z[p]=K(N(Z[p-2]),Z[p-7],M(Z[p-15]),Z[p-16]),m=L(l,R(i),S(i,j,k),Y[p],Z[p]),n=J(Q(e),T(e,f,g)),l=k,k=j,j=i,i=J(h,m),h=g,g=f,f=e,e=J(m,n);return c[0]=J(e,c[0]),c[1]=J(f,c[1]),c[2]=J(g,c[2]),c[3]=J(h,c[3]),c[4]=J(i,c[4]),c[5]=J(j,c[5]),c[6]=J(k,c[6]),c[7]=J(l,c[7]),c}function N(a,b,c,d,e){var f,g,h,i,j;if(("SHA-224"===e||"SHA-256"===e)&&2&SUPPORTED_ALGS)h=(b+65>>>9<<4)+15,j=16;else{if("SHA-384"!==e&&"SHA-512"!==e||!(4&SUPPORTED_ALGS))throw new Error("Unexpected error in SHA-2 implementation");h=(b+129>>>10<<5)+31,j=32}for(;a.length<=h;)a.push(0);for(a[b>>>5]|=128<<24-b%32,a[h]=b+c,g=a.length,f=0;g>f;f+=j)d=M(a.slice(f,f+j),d,e);if("SHA-224"===e&&2&SUPPORTED_ALGS)i=[d[0],d[1],d[2],d[3],d[4],d[5],d[6]];else if("SHA-256"===e&&2&SUPPORTED_ALGS)i=d;else if("SHA-384"===e&&4&SUPPORTED_ALGS)i=[d[0].highOrder,d[0].lowOrder,d[1].highOrder,d[1].lowOrder,d[2].highOrder,d[2].lowOrder,d[3].highOrder,d[3].lowOrder,d[4].highOrder,d[4].lowOrder,d[5].highOrder,d[5].lowOrder];else{if(!("SHA-512"===e&&4&SUPPORTED_ALGS))throw new Error("Unexpected error in SHA-2 implementation");i=[d[0].highOrder,d[0].lowOrder,d[1].highOrder,d[1].lowOrder,d[2].highOrder,d[2].lowOrder,d[3].highOrder,d[3].lowOrder,d[4].highOrder,d[4].lowOrder,d[5].highOrder,d[5].lowOrder,d[6].highOrder,d[6].lowOrder,d[7].highOrder,d[7].lowOrder]}return i}var O,P;6&SUPPORTED_ALGS&&(O=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],4&SUPPORTED_ALGS&&(P=[new b(O[0],3609767458),new b(O[1],602891725),new b(O[2],3964484399),new b(O[3],2173295548),new b(O[4],4081628472),new b(O[5],3053834265),new b(O[6],2937671579),new b(O[7],3664609560),new b(O[8],2734883394),new b(O[9],1164996542),new b(O[10],1323610764),new b(O[11],3590304994),new b(O[12],4068182383),new b(O[13],991336113),new b(O[14],633803317),new b(O[15],3479774868),new b(O[16],2666613458),new b(O[17],944711139),new b(O[18],2341262773),new b(O[19],2007800933),new b(O[20],1495990901),new b(O[21],1856431235),new b(O[22],3175218132),new b(O[23],2198950837),new b(O[24],3999719339),new b(O[25],766784016),new b(O[26],2566594879),new b(O[27],3203337956),new b(O[28],1034457026),new b(O[29],2466948901),new b(O[30],3758326383),new b(O[31],168717936),new b(O[32],1188179964),new b(O[33],1546045734),new b(O[34],1522805485),new b(O[35],2643833823),new b(O[36],2343527390),new b(O[37],1014477480),new b(O[38],1206759142),new b(O[39],344077627),new b(O[40],1290863460),new b(O[41],3158454273),new b(O[42],3505952657),new b(O[43],106217008),new b(O[44],3606008344),new b(O[45],1432725776),new b(O[46],1467031594),new b(O[47],851169720),new b(O[48],3100823752),new b(O[49],1363258195),new b(O[50],3750685593),new b(O[51],3785050280),new b(O[52],3318307427),new b(O[53],3812723403),new b(O[54],2003034995),new b(O[55],3602036899),new b(O[56],1575990012),new b(O[57],1125592928),new b(O[58],2716904306),new b(O[59],442776044),new b(O[60],593698344),new b(O[61],3733110249),new b(O[62],2999351573),new b(O[63],3815920427),new b(3391569614,3928383900),new b(3515267271,566280711),new b(3940187606,3454069534),new b(4118630271,4000239992),new b(116418474,1914138554),new b(174292421,2731055270),new b(289380356,3203993006),new b(460393269,320620315),new b(685471733,587496836),new b(852142971,1086792851),new b(1017036298,365543100),new b(1126000580,2618297676),new b(1288033470,3409855158),new b(1501505948,4234509866),new b(1607167915,987167468),new b(1816402316,1246189591)]));var Q=function(a,b,c){var d,e,f,l,m,n,o,p,q,r=0,s=[],t=0,u=a,v=!1,w=!1,x=[],y=[],z=!1;if(q=c||{},d=q.encoding||"UTF8",p=q.numRounds||1,f=k(b,d),p!==parseInt(p,10)||1>p)throw new Error("numRounds must a integer >= 1");if("SHA-1"===u&&1&SUPPORTED_ALGS)m=512,n=K,o=L,l=160;else if(6&SUPPORTED_ALGS&&(n=function(a,b){return M(a,b,u)},o=function(a,b,c,d){return N(a,b,c,d,u)}),"SHA-224"===u&&2&SUPPORTED_ALGS)m=512,l=224;else if("SHA-256"===u&&2&SUPPORTED_ALGS)m=512,l=256;else if("SHA-384"===u&&4&SUPPORTED_ALGS)m=1024,l=384;else{if(!("SHA-512"===u&&4&SUPPORTED_ALGS))throw new Error("Chosen SHA variant is not supported");m=1024,l=512}e=J(u),this.setHMACKey=function(a,b,c){var f,g,h,i,j,l,p,q;if(!0===w)throw new Error("HMAC key already set");if(!0===v)throw new Error("Cannot set HMAC key after finalizing hash");if(!0===z)throw new Error("Cannot set HMAC key after calling update");if(q=c||{},d=q.encoding||"UTF8",f=k(b,d),g=f(a),h=g.binLen,i=g.value,j=m>>>3,p=j/4-1,h/8>j){for(i=o(i,h,0,J(u));i.length<=p;)i.push(0);i[p]&=4294967040}else if(j>h/8){for(;i.length<=p;)i.push(0);i[p]&=4294967040}for(l=0;p>=l;l+=1)x[l]=909522486^i[l],y[l]=1549556828^i[l];e=n(x,e),r=m,w=!0},this.update=function(a){var b,c,d,g,h,i=0,j=m>>>5;for(b=f(a,s,t),c=b.binLen,g=b.value,d=c>>>5,h=0;d>h;h+=j)c>=i+m&&(e=n(g.slice(h,h+j),e),i+=m);r+=i,s=g.slice(i>>>5),t=c%m,z=!0},this.getHash=function(a,b){var c,d,f;if(!0===w)throw new Error("Cannot call getHash after setting HMAC key");switch(f=j(b),a){case"HEX":c=function(a){return g(a,f)};break;case"B64":c=function(a){return h(a,f)};break;case"BYTES":c=i;break;default:throw new Error("format must be HEX, B64, or BYTES")}if(!1===v)for(e=o(s,t,r,e),d=1;p>d;d+=1)e=o(e,l,0,J(u));return v=!0,c(e)},this.getHMAC=function(a,b){var c,d,f;if(!1===w)throw new Error("Cannot call getHMAC without first setting HMAC key");switch(f=j(b),a){case"HEX":c=function(a){return g(a,f)};break;case"B64":c=function(a){return h(a,f)};break;case"BYTES":c=i;break;default:throw new Error("outputFormat must be HEX, B64, or BYTES")}return!1===v&&(d=o(s,t,r,e),e=n(y,J(u)),e=o(d,l,m,e)),v=!0,c(e)}};"function"==typeof define&&define.amd?define(function(){return Q}):"undefined"!=typeof exports?"undefined"!=typeof module&&module.exports?module.exports=exports=Q:exports=Q:a.jsSHA=Q}(this);