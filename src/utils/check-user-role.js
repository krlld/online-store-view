function findIntersection(arr1, arr2) {
	const set1 = new Set(arr1);
	const intersection = arr2.filter((value) => set1.has(value));
	return intersection;
}

export const checkUserRole = (roles) => {
	const roles_array = localStorage.getItem('roles').split(',');
	const intersections = findIntersection(roles_array, roles);
	return intersections.length !== 0;
};
