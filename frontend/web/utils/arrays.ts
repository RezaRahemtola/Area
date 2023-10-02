// eslint-disable-next-line import/prefer-default-export
export const splitArrayInChunks = <T>(arr: T[], chunkSize: number) => {
	const chunks = [];

	for (let i = 0; i < arr.length; i += chunkSize) {
		const chunk = arr.slice(i, i + chunkSize);
		chunks.push(chunk);
	}

	return chunks;
};
