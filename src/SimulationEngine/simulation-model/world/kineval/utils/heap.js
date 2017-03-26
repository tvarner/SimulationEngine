		// ////////////////////////////////////////////////
		// ///     MIN HEAP
		// ////////////////////////////////////////////////

// create empty object 
export default {
	// define insert function for min binary heap

	// NOTE: insertion operation create balanced tree
	insert: function(heap, new_element) {
		// STENCIL: implement your min binary heap insert operation

		// 1. add element to end of tree
			// return if heap is initially empty
		if (heap.length === 0) { 
			heap[0] = new_element;
			return;
		}

		let index = heap.length;
		heap[index] = new_element;

		// 2. swap with parent until heaped
		let parentIndex = Math.floor( (index - 1) / 2);

		while (heap[parentIndex] > heap[index]) {
			const temp = heap[parentIndex];
			heap[parentIndex] = heap[index];
			heap[index] = temp;

			index = parentIndex;
			parentIndex = Math.floor( (index - 1) / 2);
		}
	},

	// define extract function for min binary heap
	extract: function(heap) {

		// STENCIL: implement your min binary heap extract operation

		// if heap empty, there is nothing to extract
		if (heap.length < 1) { 
			throw new Error('Cannot extract from an empty array');
		}

		// if only one element in the array (@ the root), return the extracted root 
		if (heap.length === 1) { 
			return heap.pop();
		}

		// 1. extract root element
		const extractedElement = heap[0];

		// 2. put last element at root
		heap[0] = heap.pop();

		// 3. swap with smaller child until heaped
		const rootIndex = 0;
		const child1Index = (2 * rootIndex) + 1;
		const child2Index = (2 * rootIndex) + 2;

		this.siftDown(rootIndex, child1Index, child2Index, heap);

		// 4. return extracted root element
		return extractedElement;
	},

	siftDown: function(rIndex, c1Index, c2Index, heap) {
		let _rIndex = rIndex;
		let _c1Index = c1Index;
		let _c2Index = c2Index;

		while (heap[_rIndex] > heap[_c1Index] || heap[_rIndex] > heap[_c2Index]) {

			// get the larger child index
			const childIndex = heap[_rIndex] > heap[_c1Index] ? _c1Index : _c2Index;

			// swap root element with larger child index
			const temp = heap[_rIndex];
			heap[_rIndex] = heap[childIndex];
			heap[childIndex] = temp;

			this.siftDown(_rIndex, _c1Index, _c2Index, heap);

			// reset _rIndex, _c1Index, and _c2Index
			_rIndex = childIndex;
			_c1Index = (2 * _rIndex) + 1;
			_c2Index = (2 * _rIndex) + 2;
		}
	}
};
