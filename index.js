// class BinarySearchTree {
//   constructor (array) {
//     const sortedArray = [...new Set(array)].sort((a, b) => a - b)
//     const middleElement = this.getMiddleElement(sortedArray)
//     this.rootNode = new BinarySearchTreeNode(sortedArray[middleElement])
//     sortedArray.splice(middleElement, 1)

//     for (let i = 0; i < sortedArray.length; i++) {
//       if (i === middleElement) continue
//       this.append(sortedArray[i])
//     }
//   }

//   // Access a node in the search tree
//   // access (string) {
//   //   this.rootNode
//   // }

//   getMiddleElement = (array) => Math.floor(array.length / 2)

//   search (value) {
//     const path = '[rootNode]'
//     return this.rootNode.search(value, path)
//   }

//   append (element) {
//     const node = new BinarySearchTreeNode(element)
//     this.rootNode.appendNode(node)
//   }
// }

// class BinarySearchTreeNode {
//   constructor (number) {
//     this.data = number
//     this.right = null
//     this.left = null
//   }

//   search (value, path) {
//     if (value === this.data) return path

//     const direction = value < this.data ? 'left' : 'right'
//     try {
//       return this[direction].search(value, path + `[${direction}]`)
//     } catch (error) {
//       return null
//     }
//   }

//   appendNode (node) {
//     const position = node.data < this.data ? 'left' : 'right'

//     this._append(position, node)
//   }

//   _append (place, node) {
//     if (this[place] === null) {
//       this[place] = node
//     } else {
//       this[place].appendNode(node)
//     }
//   }
// }

class BinarySearchTree {
  constructor (array) {
    const sortedArray = [...new Set(array)].sort((a, b) => a - b)
    this.root = this.returnBinarySearchTree(sortedArray, 0, sortedArray.length - 1)
  }

  exists = (num) => this.root._seekNode(num) !== null // Returns true if a node with a given number exists, and false otherwise.
  find = (num) => this.root._seekNode(num) // Returns the node with the specified number, or null if it does not exist.
  append = (num) => this.root.append(num) // Adds a node to the tree, in the correct place.
  delete = (num) => this.root.findAndDeleteNode(num) // Safely removes a node from the tree, keeping the structure intact
  depth = (num) => this.root._seekNode(num, true) // Returns the depth of the specified node, or -1 if it does not exist
  height = (num) => this.root._seekNode(num)?.height() ?? -1 // Returns the height of the specified node, or -1 if it does not exist
  isBalanced = () => this.root.isBalanced()

  rebalance () {
    const array = []
    this.root.inOrder((node) => array.push(node.data))

    const sortedArray = array.sort((a, b) => a - b)
    this.root = this.returnBinarySearchTree(sortedArray, 0, sortedArray.length - 1)
  }

  inOrder (fun) {
    if (typeof fun !== 'function') throw new Error('Argument must be a function')

    this.root.inOrder(fun)
  }

  levelOrder (fun, useRecursion = true) {
    if (typeof fun !== 'function') throw new Error('Argument must be a function')

    if (useRecursion) {
      this._levelOrderRecursive(fun, [this.root])
    } else {
      this._levelOrderIterative(fun, [this.root])
    }
  }

  // traverses the tree using recursion
  _levelOrderRecursive (fun, queue) {
    if (queue.length === 0) return

    // Remove a node from the queue, and call the callback function
    const currentNode = queue.shift()
    fun(currentNode)

    // Add the child nodes in order to the queue
    if (currentNode.left !== null) queue.push(currentNode.left)
    if (currentNode.right !== null) queue.push(currentNode.right)

    this._levelOrder(fun, queue)
  }

  // traverses the tree using a `while` loop
  _levelOrderIterative (fun, queue) {
    while (queue.length !== 0) {
      // Execute the function
      const currentNode = queue.shift()
      fun(currentNode)

      // Add the child nodes in order to the queue
      if (currentNode.left !== null) queue.push(currentNode.left)
      if (currentNode.right !== null) queue.push(currentNode.right)
    }
  }

  returnBinarySearchTree (sortedArray, start, end) {
    if (start > end) return null

    const midpoint = start + Math.floor((end - start) / 2)

    const root = new BSTNode(sortedArray[midpoint])
    root.left = this.returnBinarySearchTree(sortedArray, start, midpoint - 1)
    root.right = this.returnBinarySearchTree(sortedArray, midpoint + 1, end)

    return root
  }

  print (node = this.root, prefix = '', isLeft = true) {
    if (node === null) {
      return
    }
    if (node.right !== null) {
      this.print(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false)
    }
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`)
    if (node.left !== null) {
      this.print(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true)
    }
  }
}

class BSTNode {
  constructor (num) {
    this.data = num
    this.left = null
    this.right = null
  }

  height (accumulator = 0) {
    if (this.numChildNodes() === 0) {
      return accumulator
    }

    const leftNodeHeight = this.left?.height(accumulator + 1) ?? 0
    const rightNodeHeight = this.right?.height(accumulator + 1) ?? 0
    const totalHeight = Math.max(leftNodeHeight, rightNodeHeight)

    return totalHeight
  }

  inOrder (fun) {
    
    this.left?.inOrder(fun)
    fun(this)
    this.right?.inOrder(fun)
  }

  // if `returnSteps` is false, returns the node if found and null if the node does not exist
  // if `returnSteps` is true, returns the depth of node instead, or null if node does not exist
  _seekNode (num, returnSteps = false, steps = 0) {
    if (num === this.data) return returnSteps ? steps : this
    const side = num < this.data ? 'left' : 'right'
    return returnSteps ? steps : this[side]?._seekNode(num, returnSteps, steps + 1) ?? null
  }

  findAndDeleteNode (num) {
    if (this.data === num) {
      let successor = this.right
      while (successor.left !== null) {
        successor = successor.left
      }
      this.findAndDeleteNode(successor.data)
      this.data = successor.data
      return
    }
    const side = num < this.data ? 'left' : 'right'
    if (this[side]?.data === num) {
      this.deleteNodeFromParent(side)
      return
    }
    if (this[side] !== null) {
      this[side].findAndDeleteNode(num)
    }
  }

  deleteNodeFromParent (side) {
    if (this[side] === null) return null

    const children = this[side].numChildNodes()
    if (!children) this[side] = null
    if (children === 1) {
      const child = this[side].left ? this[side].left : this[side].right
      this[side] = child
    }
    if (children === 2) {
      let successor = this[side].right
      while (successor.left !== null) {
        successor = successor.left
      }
      this.findAndDeleteNode(successor.data)
      this[side].data = successor.data
    }
  }

  append (num) {
    const side = num < this.data ? 'left' : 'right'
    if (this.data === num) return

    if (this[side] === null) {
      this[side] = new BSTNode(num)
    } else {
      this[side].append(num)
    }
  }

  numChildNodes () {
    let childNodes = 0
    if (this.left !== null) childNodes++
    if (this.right !== null) childNodes++
    return childNodes
  }

  isBalanced () {
    const leftHeight = this.left?.height() ?? 0
    const rightHeight = this.right?.height() ?? 0
    const heightDifference = Math.abs(leftHeight - rightHeight)

    if (this.numChildNodes() === 2) {
      return this.left.isBalanced() && this.right.isBalanced() && heightDifference < 2
    }

    if (this.numChildNodes() === 1) {
      if (this.left !== null) {
        return this.left.isBalanced() && heightDifference < 2
      } else {
        return this.right.isBalanced() && heightDifference < 2
      }
    }

    return heightDifference < 2
  }
}

function generateRandomArray (size) {
  const array = []

  for (let i = 0; i < size; i++) {
    const num = Math.floor(Math.random() * 100)
    // const num = i
    array.push(num)
  }
  return array
}

const array = generateRandomArray(10)
const searchTree = new BinarySearchTree(array)
searchTree.print()
searchTree.inOrder((node) => console.log(node.data))
