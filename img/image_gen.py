# run in project root

import os

from glob import glob
from PIL import Image

os.chdir('img')
base_layer = Image.open('set_card_blank.png')
if not os.path.exists('result'):
  os.makedirs('result')

if __name__ == '__main__':
  for fname in glob('original/*.png'):
    image = Image.open(fname)
    base = Image.new('RGB', base_layer.size)
    base.paste(base_layer)
    box = ((base.width - image.width) // 2, (base.height - image.height) // 2,
      (base.width + image.width) // 2, (base.height + image.height) // 2)
    base.paste(image, box)
    base.save('result/set_card_' + os.path.split(fname)[1].replace('-', '_'), 'png')
