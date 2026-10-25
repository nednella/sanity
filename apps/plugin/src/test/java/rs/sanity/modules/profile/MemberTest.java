package rs.sanity.modules.profile;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import org.junit.Test;

public class MemberTest
{
	@Test
	public void includesTheMainRsn()
	{
		assertTrue(new Member.Rsn("Zezima", null).includes("Zezima"));
	}

	@Test
	public void includesTheAltRsn()
	{
		assertTrue(new Member.Rsn("Zezima", "Zezima Alt").includes("Zezima Alt"));
	}

	@Test
	public void ignoresCase()
	{
		assertTrue(new Member.Rsn("Zezima", null).includes("zEZIMA"));
	}

	@Test
	public void treatsSpacesUnderscoresAndHyphensAsTheSame()
	{
		Member.Rsn rsn = new Member.Rsn("Iron Man", "Iron_Alt");
		assertTrue(rsn.includes("Iron_Man"));
		assertTrue(rsn.includes("Iron-Man"));
		assertTrue(rsn.includes("Iron Man"));
		assertTrue(rsn.includes("Iron Alt"));
	}

	@Test
	public void excludesAnotherAccount()
	{
		assertFalse(new Member.Rsn("Zezima", "Zezima Alt").includes("Woox"));
	}

	@Test
	public void excludesEveryNameWhenNoRsnIsOnFile()
	{
		assertFalse(new Member.Rsn(null, null).includes("Zezima"));
	}
}
