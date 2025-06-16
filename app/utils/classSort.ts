export function compareClassNames(a: string, b: string) {
    const [numA, letterA] = a.split('-');
    const [numB, letterB] = b.split('-');

    const numANum = parseInt(numA, 10);
    const numBNum = parseInt(numB, 10);

    if (numANum < numBNum) return -1;
    if (numANum > numBNum) return 1;

    if (letterA && letterB) {
        return letterA.localeCompare(letterB, 'ru');
    }

    if (letterA) return 1;
    if (letterB) return -1;

    return 0;
}
