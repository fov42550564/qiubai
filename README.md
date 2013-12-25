Copyright (c) 2013 YunJiang.Fang contributors (listed above).

offline-qiubai
===========
![](http://pic27.nipic.com/20130304/2045591_114304202119_2.jpg)

download qiubai offline and genarate html files <br \>


note
------------

if you want to read qiubai online with nodejs, <br \>
please turn to [node-qiubai] which base on [node-webkit]

Installation
------------

Install with `npm`:

``` bash
$ npm install qiubai
```

Example
-------

``` js
var QiuBai = require("..");

var qiubai = new QiuBai();
qiubai.startSave("fang", 2);
```

Output
-------
`fang`<br />
|--`8hr`<br />
|--`hot`<br />
|--`week`<br />
|--`month`<br />
|--`imgrank`<br />
|--`pic`<br />
|--`late`<br />
|--`history`<br />

API
-------
QiuBai.startSave(destDir, maxSavePages);<br />

`destDir` is qiubai offline file store in<br />
`maxSavePages` is you want to save pages<br />
qiubai has types as:<br />
`8hr`, `hot`, `week`, `month`, `imgrank`, `pic`, `late`, `history`<br />
default all types will be download, if you want to modify it, modify `lib/qiubai.js`<br />

License
-------
The MIT License (MIT)

	Copyright (c) 2013 YunJiang.Fang

	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
	the Software, and to permit persons to whom the Software is furnished to do so, 
	subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all 
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
	FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
	COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
	IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
	CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[node-qiubai]: https://npmjs.org/package/node-qiubai
[node-webkit]: https://github.com/rogerwang/node-webkit
