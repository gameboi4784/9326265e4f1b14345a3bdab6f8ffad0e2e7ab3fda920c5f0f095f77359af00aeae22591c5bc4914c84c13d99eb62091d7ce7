import os

# --- Configuration ---
CONFIG = {
    'base': {
        'source_dir': '.',  # root directory
        'exclude_dirs_root': {'bossrush', 'drweb', 'utyweb'},
        'exclude_dirs_utweb': {'cache', 'music'},  # exclude music from base
        'output_file': os.path.join('utweb', 'cache', 'base.txt')
    },
    'ostplayer': {
        'source_dir': os.path.join('utweb', 'music'),  # just music folder
        'output_file': os.path.join('utweb', 'cache', 'ostplayer.txt')
    }
}

def generate_file_list(root_path, exclude_dirs_root=None, exclude_dirs_utweb=None):
    file_paths = []

    if exclude_dirs_root is None:
        exclude_dirs_root = set()
    if exclude_dirs_utweb is None:
        exclude_dirs_utweb = set()

    for dirpath, dirnames, filenames in os.walk(root_path):
        rel_dir = os.path.relpath(dirpath, '.').replace('\\', '/')
        if rel_dir == '.':
            dirnames[:] = [d for d in dirnames if d not in exclude_dirs_root]
        elif rel_dir.startswith('utweb'):
            dirnames[:] = [d for d in dirnames if d not in exclude_dirs_utweb]

        for filename in filenames:
            if filename == '.DS_Store' or filename.endswith('.py'):
                continue

            full_path = os.path.join(dirpath, filename)
            web_path = os.path.relpath(full_path, '.').replace('\\', '/')
            web_path = '/' + web_path  # remove ./ and ensure leading slash
            file_paths.append(web_path)

    return sorted(file_paths)

def main():
    print("Starting cache list generation...")

    output_dir = os.path.join('utweb', 'cache')
    os.makedirs(output_dir, exist_ok=True)

    for name, settings in CONFIG.items():
        print(f"\nProcessing '{name}' files...")

        source = settings['source_dir']
        output = settings['output_file']

        if name == 'base':
            files = generate_file_list(
                source,
                exclude_dirs_root=settings.get('exclude_dirs_root'),
                exclude_dirs_utweb=settings.get('exclude_dirs_utweb')
            )
        elif name == 'ostplayer':
            files = generate_file_list(source)

        with open(output, 'w', encoding='utf-8') as f:
            for file_path in files:
                f.write(file_path + '\n')
        print(f"Generated '{output}' with {len(files)} files.")

    print("\nCache list generation complete!")

if __name__ == "__main__":
    main()
