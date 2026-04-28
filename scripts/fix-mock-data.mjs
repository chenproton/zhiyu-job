import fs from 'node:fs'

let content = fs.readFileSync('lib/mock-data/positions.ts', 'utf8')

// Convert responsibilities: string[] to PositionResponsibility[]
const respRegex = /responsibilities: \[(\n(?:      '[^']*',?\n)*)    \],/g

content = content.replace(respRegex, (match, itemsStr) => {
  const items = itemsStr.trim().split('\n').map(s => s.trim()).filter(s => s.startsWith("'"))
  const objects = items.map((item, i) => {
    const name = item.replace(/^'/, '').replace(/',?$/, '')
    return `      { id: 'resp-${i + 1}', name: '${name}', description: '' }`
  })
  return `responsibilities: [\n${objects.join(',\n')}\n    ],`
})

// Add abilityBindings and abilityDomains fields after competencyConfig
// Use a simpler approach - replace each occurrence individually
const competencyRegex = /(competencyConfig: \[[\s\S]*?\],)(\n    createdBy:)/g
let count = 0
content = content.replace(competencyRegex, (match, p1, p2) => {
  count++
  return `${p1}\n    abilityBindings: [],\n    abilityDomains: [],${p2}`
})

fs.writeFileSync('lib/mock-data/positions.ts', content)
console.log(`Mock data updated. Fixed ${count} positions.`)
