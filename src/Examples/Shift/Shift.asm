.text
.globl main
main: 
addiu $t0, $0, 1
addiu $t1, $0, 256
sll $t0, $t0, 4
srl $t1, $t1, 4
and $t2, $t1, $t0
end: j end
