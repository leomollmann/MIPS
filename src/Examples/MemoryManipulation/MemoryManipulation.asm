.text
.globl main
main: 
la $a0,A
la $a1,B
lw $t0, 0($a0)
lw $t1, 0($a1)
addu $t1, $t0, $t1
sw $t1, 0($a1)
end: j end
.data
A: 40
B: 50
