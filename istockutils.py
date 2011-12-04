#!/usr/bin/python

import urllib,re
from flask import Flask, render_template
from Image import Image

app = Flask(__name__)

@app.route("/")
def index():
	'index page with input form'
	return render_template('form.html')


@app.route('/output/<id>')
def output(id):
	'outputs page with lightbox image and related photos'
	ubbstr = ''
	thumbs = []
	file_handle = urllib.urlopen('http://www.istockphoto.com/search/lightbox/' + id)
	file_contents = file_handle.read()
	file_handle.close()
	exp_imgs = re.compile(r"file_thumbview_approve\\\/(\d+)\\\/")
	match = re.search(r"\| Lightbox: ([\b\w\s\b]+) ", file_contents)
	if match:
		name = match.group(1)
	else:
		name = "Lightbox Name Goes Here"
	ids = exp_imgs.findall(file_contents)
	ids = list(set(ids)) # dedupe
	for id in ids:
		i = Image(None, None, None, id)
		ubbstr += i.get_ubb_string()
		thumbs.append({
			'id'  : id, 
			'src' : i.get_thumb_src(), 
			'ubb' : i.get_ubb_string()
		})
	return render_template('output.html', name=name, thumbs=thumbs, ubbstring=ubbstr)


@app.route('/get/lightbox/<id>')
def get_lightbox(id):
	'proxy servie for exposing istock lightbox html to local origin for ajax requests'
	'@TODO move this to Image object and call it from output method above'
	file_handle = urllib.urlopen('http://www.istockphoto.com/search/lightbox/' + id)
	file_contents = file_handle.read()
	file_handle.close()
	exp = re.compile(r"file_thumbview_approve\\\/(\d+)\\\/")
	img_ids = exp.findall(file_contents)
	return img_ids[2]


if __name__ == '__main__':
	app.debug = True
	app.run(host='0.0.0.0')

