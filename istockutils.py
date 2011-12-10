#!/usr/bin/python

import urllib, re
from flask import Flask, render_template, send_from_directory
from Image import Image

app = Flask(__name__)

def get_lightbox_source(id):
	'''Returns source of iStockphoto's lightbox page for passed id'''
	file_handle = urllib.urlopen('http://www.istockphoto.com/search/lightbox/' + id)
	file_contents = file_handle.read()
	file_handle.close()
	return file_contents


@app.route("/favicon.ico")
def favicon():
	return send_from_directory(os.path.join(app.root_path, 'static'),
								'favicon.ico', mimetype='image/vnd.microsoft.icon')


@app.route("/")
def index():
	'''Renders index page with input form'''
	return render_template('form.html')


@app.route('/output/<id>')
def output(id):
	'''Renders output page with lightbox image and related photos'''
	ubbstr = ''
	thumbs = []
	file_contents = get_lightbox_source(id)
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
		ubbstr += i.get_ubb_string() + ' '
		thumbs.append({
			'id'  : id, 
			'src' : i.get_thumb_src(), 
			'ubb' : i.get_ubb_string()
		})
	return render_template('output.html', id=id, name=name, thumbs=thumbs, ubbstring=ubbstr)


@app.route('/get/lightbox/<id>')
def get_lightbox(id):
	'''Proxy service for exposing istock lightbox html to local origin for ajax requests'''
	file_contents = get_lightbox_src(id)
	exp = re.compile(r"file_thumbview_approve\\\/(\d+)\\\/")
	img_ids = exp.findall(file_contents)
	return img_ids[2]


if __name__ == '__main__':
	app.debug = True
	app.run(host='0.0.0.0')

