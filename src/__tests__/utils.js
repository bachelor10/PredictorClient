import * as utils from '../utils'

describe('Utils', () => {
    it('Splits overlapping coordinates into two lists', () => {

        const buffer = [
            [
                {x: 0, y: 0},
                {x: 5, y: 5},
                {x: -5, y: -5},
                {x: 10, y: 10}
            ]
        ]
        const newBuffer = utils.removeOverlapping(buffer, {x: -2.5, y: -2.5}, 5)


        expect(newBuffer).toEqual([
            [{x: 5, y: 5}],
            [{x: 10, y: 10}]
        ])
    })

    it('Removes list when all coordinates are deleted', () => {
        const buffer = [
            [
                {x: 0, y: 0},
            ]
        ]

        const newBuffer = utils.removeOverlapping(buffer, {x: 0, y: 0})

        expect(newBuffer).toEqual([])
    })
})

