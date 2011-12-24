
class Image:

	url_istock = 'http://www.istockphoto.com'

	def __init__(self, width=None, height=None, caption=None, id=None):
		self.id = id
		self.width = width
		self.height = height 
		self.caption = caption


	def get_dims(self):
		return [self.width, self.height]


	def get_thumb_src(self, thumb_size='1'):
		return '{0}/file_thumbview/{1}/{2}/'.format(self.url_istock, self.id, thumb_size)


	def get_ubb_string(self):
		return '[url={0}{1}{2}][img]{3}[/img][/url] '.format(self.url_istock, '/file_closeup.php?id=', self.id, self.get_thumb_src())

