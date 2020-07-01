.text
.globl main
main: 
addiu $t0, $0, 100
addiu $t1, $0, 101
xor $t2, $t1, $t0
andi $t3, $t2, 1
ori $t4, $t2, 1
and $t5, $t3, $t4
end: j end
