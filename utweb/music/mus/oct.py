import os

files = [f for f in os.listdir('.') if f.endswith('.mp3')]
with open('songs.js', 'w') as out:
    out.write("const songslol = [\n")
    for f in files:
        out.write(f'  "mus/{f}",\n')
    out.write("];\n")
