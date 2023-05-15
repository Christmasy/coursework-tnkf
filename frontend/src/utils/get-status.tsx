export function getStatus(statusCode: number): string | undefined {
    const codeToName = new Map<number, string>([
      [0, 'Backlog'],
      [1, 'To Do'],
      [2, 'In Progress'],
      [3, 'Code Review'],
      [4, 'Done'],
    ]);
    return codeToName.get(statusCode);
}
