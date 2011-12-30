#!/usr/bin/python

import urllib, re, logging, sys, os
from flask import Flask, render_template, send_from_directory
from Image import Image
# from BeautifulSoup import BeautifulSoup

app = Flask(__name__)
logging.basicConfig(stream=sys.stderr)

def get_lightbox_source(id):
	'''Returns source of iStockphoto's lightbox page for passed id'''
	file_handle   = urllib.urlopen('http://www.istockphoto.com/search/lightbox/' + id)
	file_contents = file_handle.read()
	file_handle.close()
	logging.error(file_contents[0:500])
	return file_contents


@app.route('/favicon.ico')
def favicon():
	return send_from_directory(
				os.path.join(app.root_path, 'static'),
				'favicon.ico', 
				mimetype='image/vnd.microsoft.icon')


@app.route('/')
def index():
	'''Renders index page with input form'''
	return render_template('form.html')


@app.route('/output/<id>')
def output(id):
	'''Renders output page with lightbox image and related photos. 
	Lightbox title is absent from the page source unless logged into 
	iStockphoto so making title flat and editable on page'''
	file_contents = get_lightbox_source(id)
	exp_imgs      = re.compile(r"file_thumbview_approve\\\/(\d+)\\\/")
#	soup          = BeautifulSoup(file_contents)
#	title         = soup.findAll(id='searchTitleCaption')
#	matches       = re.search(r'\| Lightbox: ([\b\w\s\b]+) ', file_contents)
	ubbstr        = ''
	thumbs        = []

#	if matches:
#		name = matches.group(1)
#	else:
#		name = soup.title #'Lightbox Name Goes Here'

	ids = exp_imgs.findall(file_contents)
	ids = list(set(ids)) # dedupe
	for image_id in ids:
		i = Image(None, None, None, image_id)
		ubbstr += i.get_ubb_string() + ' '
		thumbs.append({
			'id'  : image_id, 
			'src' : i.get_thumb_src(), 
			'ubb' : i.get_ubb_string()
		})
	return render_template('output.html', id=id, name='Lightbox', thumbs=thumbs, ubbstring=ubbstr)


@app.route('/get/lightbox/<id>')
def get_lightbox(id):
	'''Proxy service for exposing istock lightbox html to local origin for ajax requests'''
	file_contents = get_lightbox_source(id)
	exp = re.compile(r"file_thumbview_approve\\\/(\d+)\\\/")
	img_ids = exp.findall(file_contents)
	return (', ').join(img_ids)


if __name__ == '__main__':
	app.debug = True
	app.run(host='0.0.0.0')

