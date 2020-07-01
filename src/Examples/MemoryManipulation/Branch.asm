.text
.globl main
main:
addiu $t0, $0, 100
addiu $t1, $0, 130
loop:
addiu $t0, $t0, 10
slt $t2, $t0, $t1
bne $t2, $0, loop
sll $1, $1, -19
end: j end