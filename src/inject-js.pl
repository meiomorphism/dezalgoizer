#!/usr/bin/perl -w

sub slurp ($) {
	local $/ = undef;
	local *FH;
	my $txt;
	
	(open FH, shift) or die $!;
	(-f FH and sysread FH, $txt, -s FH) or die $!;
	return $txt;
}

die "Wrong number of arguments; expected 2" unless scalar @ARGV == 2;

my $ht = slurp($ARGV[0]);
my $jt = slurp($ARGV[1]);

$jt =~ s/'/%27/g;
$ht =~ s/#####/'$jt'/;

print $ht;
