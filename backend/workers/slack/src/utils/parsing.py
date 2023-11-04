import sys


def get_arguments(keys_needed):
    args = {}
    for i in range(2, len(sys.argv)):
        if sys.argv[i].startswith("--"):
            if not sys.argv[i + 1]:
                print(F"Error: No value specified for {sys.argv[i]}")
                exit(1)
            args[sys.argv[i][2:]] = sys.argv[i + 1]
            i += 1

    missing = keys_needed.difference(args.keys())
    if missing:
        print(F"Error: Missing required keys: {missing}")
        exit(1)
    return args
