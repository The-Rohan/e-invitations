import os
import re
import glob
import subprocess
from concurrent.futures import ThreadPoolExecutor

headers = [
    '-H', 'Referer: https://ceremoniainvites.com/preview/bazm-e-shahi',
    '-H', 'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X)'
]

preview_dir = '/Users/rohanalvi/Downloads/E-INVITATIONS/ceremoniainvites.com/ceremoniainvites.com/preview'
target_base = '/Users/rohanalvi/Downloads/E-INVITATIONS/dawatna/public'

videos = set()
for html_file in glob.glob(os.path.join(preview_dir, '*.html')):
    with open(html_file, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    found = re.findall(r'data-(?:mob|wide|src)=\"([^\"]+?\.mp4[^\"]*)\"', content)
    for v in found:
        videos.add(v)

print(f"Found {len(videos)} video paths to download.")

def download_video(v):
    url = 'https://ceremoniainvites.com' + v
    clean_path = v.split('?')[0]
    local_path = os.path.join(target_base, clean_path.lstrip('/'))
    
    if os.path.exists(local_path) and os.path.getsize(local_path) > 50000:
        print(f"Skipping {clean_path} (already {os.path.getsize(local_path)} bytes)")
        return True
        
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    temp_path = local_path + '.part'
    
    cmd = ['curl', '-s', '-L'] + headers + ['-o', temp_path, url]
    res = subprocess.run(cmd)
    if res.returncode == 0 and os.path.exists(temp_path) and os.path.getsize(temp_path) > 10000:
        os.rename(temp_path, local_path)
        print(f"Downloaded {clean_path} ({os.path.getsize(local_path)} bytes)")
        return True
    else:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        print(f"Failed to download {clean_path}")
        return False

with ThreadPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(download_video, sorted(videos)))

print(f"Completed! Success count: {sum(1 for r in results if r)} / {len(videos)}")
