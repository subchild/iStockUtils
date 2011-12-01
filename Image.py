
class Image:

	url_istock = "http://www.istockphoto.com"

	def __init__(self, width=None, height=None, caption=None, id=None):
		self.width = width
		self.height = height 
		self.caption = caption
		self.id = id


	def get_dims(self):
		return [self.width, self.height]


	def get_thumb_src(self, thumb_size=1):
		url_thumb  = '/file_thumbview/'
		return self.url_istock + url_thumb + self.id + '/' + str(thumb_size) + '/' 


	def get_ubb_string(self):
		delimiter = ' '
		url_detail = '/file_closeup_edit.php?id='
		ubb	  = "[url=" + self.url_istock + url_detail + self.id + "]"
		ubb  +=	"[img]" + self.get_thumb_src() + "[/img]"
		ubb  += "[/url]"
		return ubb

