require('shelljs/global');
var fs = require("fs");
var path = require("path");
var http = require("http");
var jsdom = require("jsdom");
var jquery = require('fs').readFileSync(path.join(__dirname, "..", "public",'jquery.js')).toString();
var types = ["8hr", "hot", "week", "month", "imgrank", "pic", "late", "history"];

var QiuBai = (function() {
	function QiuBai() {
		this.type = "8hr";
		this.page = 1;
		this.imgNums = {};
		this.savePath = "qb_files";
		this.toSavePages = 10;
	}
	QiuBai.prototype.startSave = function(savePath, toSavePages) {
		this.savePath = savePath;
		this.toSavePages = toSavePages;

		mkdir("-p", this.savePath);
		this.copyStableFiles();
		console.log("====start save in %s====", this.type);
		this.savePage(1);
	}
	QiuBai.prototype.getPreType = function() {
		for(var i in types) {
			if (types[i] == this.type) {
				return types[parseInt(i)-1];
			}
		}
		return null;
	};
	QiuBai.prototype.getNextType = function() {
		for(var i in types) {
			if (types[i] == this.type) {
				return types[parseInt(i)+1];
			}
		}
		return null;
	};
	QiuBai.prototype.copyStableFiles = function() {
		cp(path.join(__dirname, "..", "public","index.html"), this.savePath);
		var cssPath = path.join(this.savePath, "css");
		mkdir("-p", cssPath);
		cp(path.join(__dirname, "..", "public", "style.css"), cssPath);
		cp(path.join(__dirname, "..", "public", "back.jpg"), cssPath);
	}
	QiuBai.prototype.writeHTMLHead = function(fd, title) {
		var prePage = (this.page==1)?this.toSavePages:this.page-1;
		var preSection = this.getPreType();
		if (!preSection) {
			preSection = types[types.length-1];
		}

		prePage += ".html";
		preSection = path.join("..", preSection, "1.html");
		var menu = path.join("..", "index.html");

		fs.writeSync(fd, ' \
		<html> \
		<head> \
		<title>'+title+'</title> \
		<meta http-equiv="content-type" content="text/html; charset=utf-8"> \
		<link rel="stylesheet" href="../css/style.css"> \
		<script> \
		function switchImageSize(event){ \
		var e = event||window.event; \
		var img = event.srcElement || e.target; \
		img.className = (img.className == "scaleimg")?"origimg":"scaleimg"; \
		} \
		</script> \
		</head> \
		<body> \
		<a class="lefta" href="'+prePage+'">上一页</a> \
		<a class="middlea" href="'+menu+'">目录</a> \
		<a class="righta" href="'+preSection+'">上一节</a> \
		');
	}
	QiuBai.prototype.writeHTMLTail = function(fd) {
		var nextPage = (this.page==this.toSavePages)?1:this.page+1;
		var nextSection = this.getNextType();
		if (!nextSection) {
			nextSection = types[0];
		}
		nextPage += ".html";
		nextSection = path.join("..", nextSection, "1.html");
		var menu = path.join("..", "index.html");

		fs.writeSync(fd, '</body></html> \
		<a class="lefta" href="'+nextPage+'">下一页</a> \
		<a class="middlea" href="'+menu+'">目录</a> \
		<a class="righta" href="'+nextSection+'">下一节</a>');
	}
	QiuBai.prototype.writeHTMLItem = function(fd, text, img) {
		fs.writeSync(fd, '<div class="item"><div class="text">'+text+'</div>');
		if (img) {
			fs.writeSync(fd, '<img class="scaleimg" src="'+img+'" onclick="switchImageSize(event)">');
		}
		fs.writeSync(fd, '</div>');
	}
	QiuBai.prototype.savePage = function(page) {
		if (page <= this.toSavePages) {
			this.page = page;
			this.updateContent(QiuBai.saveContent);
		} else {
			var type = this.getNextType();
			if (type) {
				this.page = 1;
				this.type = type;
				console.log("====start save in %s====", this.type);
				this.updateContent(QiuBai.saveContent);
			}
		}
	};
	QiuBai.prototype.saveImageToFile = function(url, file) {
		http.get(url, function(res) {
			res.setEncoding('binary');
			var imageData="";
			res.on("data", function(data){
				imageData+=data;
			}).on("end", function(){
				var buffer=new Buffer(imageData,"Binary");
				fs.writeFileSync(file, buffer);
			}); 
		}).on('error', function(e) {
			console.log("Got error: " + e.message);
		});
	};
	QiuBai.saveContent = function(_self, window) {
		var $ = window.$;
		var i = (!_self.imgNums[_self.type])?0:_self.imgNums[_self.type];
		var sectionPath = path.join(_self.savePath, _self.type);
		mkdir("-p", sectionPath);

		var htmlFile = path.join(sectionPath, _self.page+".html");
		var fd = fs.openSync(htmlFile, "w");
		_self.writeHTMLHead(fd, _self.type+i);
		$("div[title]").each(function() {
			var imgFile = path.join(sectionPath, "img"+i);
			var img;
			var text = $(this).text();
			var next = $(this).next();
			if (next[0].className == "thumb") {
				_self.saveImageToFile(next.find('img').attr('src'), imgFile);
				img = "img"+i;
				i++;
			}
			_self.writeHTMLItem(fd, text, img);
		});
		_self.writeHTMLTail(fd);
		fs.closeSync(fd);
		_self.imgNums[_self.type] = i;
		console.log("complete %d page in %s", _self.page, _self.type);

		_self.savePage(_self.page+1);
	};
	QiuBai.prototype.updateContent = function(callback) {
		var userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:23.0) Gecko/20100101 Firefox/23.0';
		var _self = this;
		jsdom.env({
			url: 'http://www.qiushibaike.com/'+_self.type+'/page/'+_self.page+'?s=4620120&slow',
			headers: { 'User-Agent': userAgent },
			src: [jquery],
			done: function (errors, window) {
				callback(_self, window);
			}
		});
	};
	return QiuBai;
}());

module.exports = QiuBai;

