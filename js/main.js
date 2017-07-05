init(100, "mylegend", 320, 480, main);
var loadingLayer, backLayer, resultLayer;
var imgList = {};
var bitmap = {};
var tempX = 0,
	tempY = 0,
	bol = true,
	sum = 0,
	text1, text2, h = 0,
	m = 0,
	s = 0,
	thetime, theImg;
var imgData = new Array({
	name: "bu",
	path: "img/biu.png"
});

function main() {
	LGlobal.align = LStageAlign.MIDDLE;
	LGlobal.stageScale = LStageScaleMode.SHOW_ALL;
	LSystem.screen(LStage.FULL_SCREEN);
	backLayer = new LSprite();
	addChild(backLayer);
	loadingLayer = new LoadingSample3();
	backLayer.addChild(loadingLayer);
	LLoadManage.load( //加载
		imgData,
		function(progress) {
			loadingLayer.setProgress(progress);
		},
		function(result) {
			imgList = result;
			backLayer.removeChild(loadingLayer);
			loadingLayer = null;
			gameInit();
		}
	)
}

function gameInit() { //添加游戏背景
	backLayer.graphics.drawRect(0, '#103820', [0, 0, LGlobal.width, LGlobal.height], true, '#012345');

	initResultLayer(); //结果显示层初始化

	initClickLayer(); //操作层初始化

	text1 = new LTextField();
	text1.text = "操作数";
	text1.size = 20;
	text1.x = LGlobal.width * 0.6;
	text1.y = LGlobal.height * 0.7;
	text1.color = "#FFFFFF";
	text1.weight = "bolder";
	backLayer.addChild(text1);

	text2 = new LTextField();
	text2.text = sum;
	text2.size = 20;
	text2.x = LGlobal.width * 0.6 + (text1.getWidth() - text2.getWidth()) / 2;
	text2.y = LGlobal.height * 0.8;
	text2.color = "#FFFFFF";
	text2.weight = "bolder";
	backLayer.addChild(text2);
	thetime = new LTextField();

	backLayer.addEventListener(LEvent.ENTER_FRAME, time);

}

function time() { //时间显示
	if (s < 10) {
		if (m < 10) {
			if (h < 10) thetime.text = "0" + h + ":" + "0" + m + ":" + "0" + parseInt(s);
			else thetime.text = h + ":" + "0" + m + ":" + "0" + parseInt(s);
		} else {
			if (h < 10) thetime.text = "0" + h + ":" + m + ":" + "0" + parseInt(s);
			else thetime.text = h + ":" + m + ":" + "0" + parseInt(s);
		}
	} else {
		if (m < 10) {
			if (h < 10) thetime.text = "0" + h + ":" + "0" + m + ":" + parseInt(s);
			else thetime.text = h + ":" + "0" + m + ":" + parseInt(s);
		} else {
			if (h < 10) thetime.text = "0" + h + ":" + m + ":" + parseInt(s);
			else thetime.text = h + ":" + m + ":" + parseInt(s);
		}
	}
	thetime.x = LGlobal.width * 0.6 + (text1.getWidth() - text2.getWidth()) / 2;
	thetime.y = LGlobal.height * 0.9;
	backLayer.addChild(thetime);
	s += 0.1;
	if (parseInt(s) == 60) {
		s = 0;
		m++;
	}
	if (m == 60) {
		m = 0;
		h++;
	}
}

function initResultLayer() {
	resultLayer = new LSprite();
	resultLayer.graphics.drawRect(0, '#111111', [0, 0, LGlobal.width * 0.4, LGlobal.width * 0.4], true, '#CCCCCC');
	resultLayer.x = LGlobal.width * 0.1;
	resultLayer.y = LGlobal.height * 0.7;
	backLayer.addChild(resultLayer);
	theImg = new LBitmap(new LBitmapData(imgList["bu"], 0, 0, imgList["bu"].width, imgList["bu"].height));
	theImg.scaleX = LGlobal.width * 0.4 / imgList["bu"].width;
	theImg.scaleY = LGlobal.width * 0.4 / imgList["bu"].width;
	resultLayer.addChild(theImg);
}

function initClickLayer() {
	clickLayer = new LSprite();
	clickLayer.graphics.drawRect(0, '#111111', [0, 0, LGlobal.width * 0.8, LGlobal.width * 0.8], true, '#ABCDEF');
	clickLayer.x = LGlobal.width * 0.1;
	clickLayer.y = LGlobal.width * 0.1;
	backLayer.addChild(clickLayer);
	var imgWidth = imgList["bu"].width / 3;

	var imgArr = new Array(); //存放图片块位置

	for (var i = 0; i < 9; i++) {
		bitmap[i] = new LBitmap(new LBitmapData(imgList["bu"], imgWidth * (i % 3), imgWidth * (parseInt(i / 3)), imgWidth, imgWidth));
		bitmap[i].scaleX = LGlobal.width * 0.8 / 3 / bitmap[i].width;
		bitmap[i].scaleY = LGlobal.width * 0.8 / 3 / bitmap[i].width;
		bitmap[i].x = imgWidth * LGlobal.width * 0.8 / 3 / bitmap[i].width * (i % 3);
		imgArr.push(bitmap[i].x);
		bitmap[i].y = imgWidth * LGlobal.width * 0.8 / 3 / bitmap[i].width * (parseInt(i / 3));
		imgArr.push(bitmap[i].y);
	}
	var a1 = [0, 1, 2, 3, 4, 5, 6, 7];
	var a2 = new Array();
	//使用随机数排序
	for (var i = 0; i < 8; i++) {
		a2.push(a1.splice(Math.floor(Math.random() * a1.length), 1));
	}

	for (var i = 0; i < 8; i++) {
		bitmap[i].x = imgArr[a2[i] * 2];
		bitmap[i].y = imgArr[a2[i] * 2 + 1];
		clickLayer.addChild(bitmap[i]);
	}
	tempX = bitmap[8].x;
	tempY = bitmap[8].y;
	clickLayer.removeChild(bitmap[8]);
	clickLayer.addEventListener(LMouseEvent.MOUSE_DOWN, onclick);


}


function onclick(event) {
	for (var i = 0; i < 8; i++) {
		//找到鼠标所在块
		if (bitmap[i].x + bitmap[i].width * LGlobal.width * 0.8 / 3 / bitmap[i].width >= event.selfX && event.selfX >= bitmap[i].x && bitmap[i].y + bitmap[i].height * LGlobal.width * 0.8 / 3 / bitmap[i].width >= event.selfY && event.selfY >= bitmap[i].y)
		//判断是否可以移动
			if (Math.abs(parseInt(bitmap[i].y) - parseInt(tempY)) == parseInt(bitmap[i].width * LGlobal.width * 0.8 / 3 / bitmap[i].width) && parseInt(bitmap[i].x) == parseInt(tempX) || Math.abs(parseInt(bitmap[i].x) - parseInt(tempX)) == parseInt(bitmap[i].width * LGlobal.width * 0.8 / 3 / bitmap[i].width) && parseInt(bitmap[i].y) == parseInt(tempY)) { //进行移动
			var tempx, tempy;
			tempx = bitmap[i].x;
			tempy = bitmap[i].y;
			bitmap[i].x = tempX;
			bitmap[i].y = tempY;
			tempX = tempx;
			tempY = tempy;
			sum++;
			text2.text = sum;
			//判断图片是否复原
			for (var i = 0; i < 6; i += 3) {
				if (parseInt(bitmap[i].y) == parseInt(bitmap[i + 1].y) && parseInt(bitmap[i + 1].y) == parseInt(bitmap[i + 2].y) && parseInt(bitmap[i].x) < parseInt(bitmap[i + 1].x) && parseInt(bitmap[i + 2].x) > parseInt(bitmap[i + 1].x)) {
					bol = true;
				} else {
					bol = false;
					break;
				}
			}

			if (bol == true) {
				if (parseInt(bitmap[6].y) == parseInt(bitmap[7].y) && parseInt(bitmap[6].x) == parseInt(bitmap[7].x) - parseInt(bitmap[6].width * LGlobal.width * 0.8 / 3 / bitmap[6].width) && parseInt(bitmap[0].y) < parseInt(bitmap[3].y) && parseInt(bitmap[3].y) < parseInt(bitmap[6].y) && parseInt(bitmap[6].x) == 0) {
					clickLayer.removeEventListener(LMouseEvent.MOUSE_DOWN, onclick);
					backLayer.removeEventListener(LEvent.ENTER_FRAME, time);

				}
			}

		}
	}
}