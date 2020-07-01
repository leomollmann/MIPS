.text
.globl main
main:
addiu $t0, $0, 130
addiu $t1, $0, 130
loop:
beq $t1, $t0, end
addiu $t0, $t0, 10
j loop
end: j end