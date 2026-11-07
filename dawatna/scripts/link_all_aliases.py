import os
import shutil

templates_dir = '/Users/rohanalvi/Downloads/E-INVITATIONS/dawatna/public/templates'

alias_map = {
    # Ceremonia Mappings
    'shahi-mehru': 'rose-pavilion.html',
    'mehru-cinema': 'mehru-returns.html',
    # 'darbar-e-shahi' is a Crown Jewel flagship built directly with curtain.mp4
    'jharokha-wisaal': 'dastaan-e-wisaal.html',
    'jashan-bahar': 'jashan-e-bahara.html',
    'zari-tapestry': 'everlasting-stitch.html',
    'vhs-rewind': 'rewind.html',
    'madina-noor': 'madina-journey.html',
    'masjid-nabawi': 'madina-journey-2.html',
    'kiswah-gold': 'makkah-journey.html',
    'gulab-damask': 'bazm-e-ghulab.html',
    'maroon-shadi': 'royal-beginning.html',
    'linen-ivory': 'wedding-classic.html',
    'monogram-crest': 'elegant-wedding.html',
    'chandelier-ballroom': 'lavish-wedding.html',
    'ehd-e-wafa': 'ehd-e-muhabbat.html',
    'shehzadi-birthday': 'princess-birthday.html',
    'party-confetti': 'birthday-confetti.html',
    'caduceus-doctor': 'doctors-theme.html',
    'neon-portal': 'birthday-robot-pal.html',

    # Niru Mappings
    'roshni-diya': 'roshni.html',
    'dehleez-haveli': 'dehleez.html',
    'parda-sultana': 'parda.html',
    'chunri-mehndi': 'chunri.html',
    'shahi-scroll': 'farmaan.html',
    'shahi-farman': 'farmaan.html',
    'kashmir-chinar': 'chinar.html',
    'mughal-baradari': 'baradari.html',
    'neelum-valley': 'neelum.html',
    'gulab-botanical': 'gulaab.html',
    'sahar-regency': 'sahar.html',
    'kaghaz-haveli': 'kaghaz.html',
    'qasr-e-khuld': 'qasr.html',
    'firdaus-medallion': 'firdaus.html',
    'gulkari-chikankari': 'gulkari.html',
    'moti-bagh-silk': 'moti-bagh.html',
    'saahil-breeze': 'saahil.html',
    'bahar-watercolor': 'bahaar.html',
    'gulbadan-zardozi': 'gulbadan.html',
    'ajrak-sindh': 'ajrak.html',
    'aangan-jali': 'aangan.html',
    'sahil-bougainvillea': 'sahil-e-rang.html',
    'purani-haveli': 'haveli.html',
    'chandni-ripple': 'chandni.html',
    'dilkusha-palace': 'dilkusha.html',
}

for alias, target in alias_map.items():
    src_path = os.path.join(templates_dir, target)
    dest_path = os.path.join(templates_dir, f"{alias}.html")
    if os.path.exists(src_path):
        shutil.copyfile(src_path, dest_path)
        print(f"Linked {alias}.html -> {target}")
    else:
        print(f"Warning: target {target} does not exist for {alias}")

print("All aliases linked successfully!")
