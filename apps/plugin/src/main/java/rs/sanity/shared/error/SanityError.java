package rs.sanity.shared.error;

public interface SanityError
{
	String getCode();

	String getTitle();

	String getMessage();

	String getDetail();
}
