import json

log_file = r'C:\Users\jaafa\.claude\projects\C--Users-jaafa-Desktop-upload-FishWebClean\4c31d116-a9a0-4115-99ad-4ec954b0d721\tool-results\mcp-vercel-get_deployment_build_logs-1766285783324.txt'

with open(log_file, encoding='utf-8') as f:
    data = json.load(f)

logs = json.loads(data[0]['text'])
events = logs['events']

print(f'Total events: {len(events)}')

# Find first TypeScript error
first_error_idx = None
for i, e in enumerate(events):
    if 'error TS' in e.get('text', ''):
        first_error_idx = i
        break

if first_error_idx:
    print(f'\n=== 15 events before first TypeScript error (event #{first_error_idx}) ===')
    start = max(0, first_error_idx - 15)
    for i in range(start, first_error_idx):
        text = events[i]['text']
        print(f'{i}. {text[:200]}')

    print(f'\n=== First TypeScript error ===')
    print(events[first_error_idx]['text'])

# Count total TS errors
ts_errors = [e for e in events if 'error TS' in e.get('text', '')]
print(f'\n=== Total TypeScript errors: {len(ts_errors)} ===')

# Check for "tsc" or "TypeScript" mentions
tsc_mentions = [e for e in events if 'tsc' in e.get('text', '').lower() or 'typescript' in e.get('text', '').lower()]
print(f'\n=== Events mentioning "tsc" or "typescript": {len(tsc_mentions)} ===')
for e in tsc_mentions[:10]:
    print(e['text'][:200])
